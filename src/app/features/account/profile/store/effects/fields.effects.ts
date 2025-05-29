import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { delay, switchMap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { ProfileService } from '../../services/profile.service';

import { ProfileActions } from '../actions';

export const fieldsEffects = {
  loadFields: createEffect(
    (actions$ = inject(Actions), profileService = inject(ProfileService)) => {
      return actions$.pipe(
        ofType(ProfileActions.getFields),
        switchMap(({ userId }) =>
          profileService.getFields(userId).pipe(
            mapResponse({
              next: (items) => ProfileActions.getFieldsSuccess({ items }),
              error: (error: ApiError) => ProfileActions.getFieldsFailure({ error }),
            }),
          ),
        ),
        delay(1000),
      );
    },
    { functional: true },
  ),
  updateFields: createEffect(
    (actions$ = inject(Actions), profileService = inject(ProfileService)) => {
      return actions$.pipe(
        ofType(ProfileActions.updateFields),
        switchMap(({ userId, payload }) =>
          profileService.updateFields(userId, payload).pipe(
            mapResponse({
              next: (items) => ProfileActions.updateFieldsSuccess({ items }),
              error: (error: ApiError) => ProfileActions.updateFieldsFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
