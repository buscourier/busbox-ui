import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { filter, switchMap } from 'rxjs';

import { AuthFacade } from '@core/auth';

import type { ApiError } from '@shared/types';

import { ProfileService } from '../../services/profile.service';

import { ProfileActions } from '../actions';

export const fieldsEffects = {
  loadFields: createEffect(
    (
      actions$ = inject(Actions),
      auth = inject(AuthFacade),
      profileService = inject(ProfileService),
    ) => {
      return actions$.pipe(
        ofType(ProfileActions.loadFields),
        concatLatestFrom(() => auth.currentUser$),
        filter(([, user]) => !!user),
        switchMap(([, user]) =>
          profileService.getFields(user!.id).pipe(
            mapResponse({
              next: (data) => ProfileActions.loadFieldsSuccess({ data }),
              error: (error: ApiError) => ProfileActions.loadFieldsFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
  updateFields: createEffect(
    (
      actions$ = inject(Actions),
      auth = inject(AuthFacade),
      profileService = inject(ProfileService),
    ) => {
      return actions$.pipe(
        ofType(ProfileActions.updateFields),
        concatLatestFrom(() => auth.currentUser$),
        filter(([, user]) => !!user),
        switchMap(([{ payload }, user]) =>
          profileService.updateFields(user!.id, payload).pipe(
            mapResponse({
              next: (data) => ProfileActions.updateFieldsSuccess({ data }),
              error: (error: ApiError) => ProfileActions.updateFieldsFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
