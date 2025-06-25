import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TuiAlertService } from '@taiga-ui/core';
import { switchMap } from 'rxjs';

import { ProfileActions } from '../../store';

export const errorHandlingEffects = {
  errorHandling: createEffect(
    (
      actions$ = inject(Actions),
      alert = inject(TuiAlertService),
      transloco = inject(TranslocoService),
    ) => {
      return actions$.pipe(
        ofType(
          ProfileActions.loadFieldsFailure,
          ProfileActions.loadConfidantsFailure,
          ProfileActions.updateFieldsFailure,
        ),
        switchMap((action) => {
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

          return alert.open(message, {
            label: transloco.translate('alert.labels.error'),
            autoClose: 0,
            appearance: 'error',
          });
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
