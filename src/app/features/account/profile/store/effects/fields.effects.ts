import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { filter, first, switchMap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { AuthFacade } from '@auth';

import { ProfileService } from '../../services/profile.service';

import { ProfileActions } from '../actions';

export const fieldsEffects = {
  loadFields: createEffect(
    (
      actions$ = inject(Actions),
      authFacade = inject(AuthFacade),
      profileService = inject(ProfileService),
    ) => {
      return actions$.pipe(
        ofType(ProfileActions.loadFields),
        switchMap(() =>
          authFacade.getCurrentUser().pipe(
            filter((user) => !!user),
            first(),
            switchMap((user) =>
              profileService.getFields(user.id).pipe(
                mapResponse({
                  next: (data) => ProfileActions.loadFieldsSuccess({ data }),
                  error: (error: ApiError) => ProfileActions.loadFieldsFailure({ error }),
                }),
              ),
            ),
          ),
        ),
      );
    },
    { functional: true },
  ),
  updateFields: createEffect(
    (
      actions$ = inject(Actions),
      authFacade = inject(AuthFacade),
      profileService = inject(ProfileService),
    ) => {
      return actions$.pipe(
        ofType(ProfileActions.updateFields),
        switchMap(({ payload }) =>
          authFacade.getCurrentUser().pipe(
            filter((user) => !!user),
            first(),
            switchMap((user) =>
              profileService.updateFields(user.id, payload).pipe(
                mapResponse({
                  next: (data) => ProfileActions.updateFieldsSuccess({ data }),
                  error: (error: ApiError) => ProfileActions.updateFieldsFailure({ error }),
                }),
              ),
            ),
          ),
        ),
      );
    },
    { functional: true },
  ),

  // updateProfile: createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ProfileActions.update),
  //     switchMap(({ payload }) =>
  //       this.profileService.updateProfile(payload).pipe(
  //         mapResponse({
  //           next: () => ProfileActions.updateSuccess(),
  //           error: (error) => ProfileActions.updateFailure({ error }),
  //         }),
  //       ),
  //     ),
  //   ),
  // ),
  //
  // reloadAfterUpdate: createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ProfileActions.updateSuccess),
  //     switchMap(() => [
  //       ProfileActions.loadFields(),
  //       ProfileActions.loadConfidants(),  // ← На всякий случай
  //     ]),
  //   ),
  // ),
};
