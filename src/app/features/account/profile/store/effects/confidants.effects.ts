import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { delay, switchMap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { ProfileService } from '../../services/profile.service';

import { ProfileActions } from '../actions';

export const confidantsEffects = {
  loadConfidants: createEffect(
    (actions$ = inject(Actions), profileService = inject(ProfileService)) => {
      return actions$.pipe(
        ofType(ProfileActions.getConfidants),
        switchMap(({ userId }) =>
          profileService.getConfidants(userId).pipe(
            mapResponse({
              next: (items) => ProfileActions.getConfidantsSuccess({ items }),
              error: (error: ApiError) => ProfileActions.getConfidantsFailure({ error }),
            }),
          ),
        ),
        delay(1000),
      );
    },
    { functional: true },
  ),
};
