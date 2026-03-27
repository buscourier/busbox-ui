import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { NotificationsActions } from '@core/notifications';

import { ProfileActions } from '../../store';

export const errorHandlingEffects = {
  errorHandling: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(
          ProfileActions.loadFieldsFailure,
          ProfileActions.loadConfidantsFailure,
          ProfileActions.updateFieldsFailure,
        ),
        map((action) => {
          let message = '';

          switch (action.type) {
            case ProfileActions.loadFieldsFailure.type:
              message = 'Не удалось загрузить данные профиля';
              break;

            case ProfileActions.loadConfidantsFailure.type:
              message = 'Не удалось загрузить ответсвенных лиц';
              break;

            case ProfileActions.updateFieldsFailure.type:
              message = 'Не удалось обновить данные профиля';
              break;
          }

          return NotificationsActions.showError({
            message,
          });
        }),
      );
    },
    { functional: true },
  ),
};
