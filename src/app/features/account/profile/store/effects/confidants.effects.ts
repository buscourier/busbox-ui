import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { filter, first, switchMap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { AuthFacade } from '@auth';

import { ProfileService } from '../../services/profile.service';

import { ProfileActions } from '../actions';

export const confidantsEffects = {
  loadConfidants: createEffect(
    (
      actions$ = inject(Actions),
      authFacade = inject(AuthFacade),
      profileService = inject(ProfileService),
    ) => {
      return actions$.pipe(
        ofType(ProfileActions.loadConfidants),
        switchMap(() =>
          authFacade.getCurrentUser().pipe(
            filter((user) => !!user),
            first(),
            switchMap((user) =>
              profileService.getConfidants(user.id).pipe(
                mapResponse({
                  next: (data) => ProfileActions.loadConfidantsSuccess({ data }),
                  error: (error: ApiError) => ProfileActions.loadConfidantsFailure({ error }),
                }),
              ),
            ),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
