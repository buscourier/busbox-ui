import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { filter, switchMap } from 'rxjs';

import { AuthFacade } from '@core/auth';

import type { ApiError } from '@shared/types';

import { ProfileService } from '../../services/profile.service';

import { ProfileActions } from '../actions';

export const confidantsEffects = {
  loadConfidants: createEffect(
    (
      actions$ = inject(Actions),
      auth = inject(AuthFacade),
      profileService = inject(ProfileService),
    ) => {
      return actions$.pipe(
        ofType(ProfileActions.loadConfidants),
        concatLatestFrom(() => auth.currentUser$),
        filter(([, user]) => !!user),
        switchMap(([, user]) =>
          profileService.getConfidants(user!.id).pipe(
            mapResponse({
              next: (data) => ProfileActions.loadConfidantsSuccess({ data }),
              error: (error: ApiError) => ProfileActions.loadConfidantsFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
