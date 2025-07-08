import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TuiAlertService } from '@taiga-ui/core';
import { switchMap } from 'rxjs';

import { TariffsActions } from '../actions';

export const errorHandlingEffects = {
  errorHandling: createEffect(
    (
      actions$ = inject(Actions),
      alert = inject(TuiAlertService),
      transloco = inject(TranslocoService),
    ) => {
      return actions$.pipe(
        ofType(TariffsActions.loadZonesFailure, TariffsActions.loadZoneTariffsFailure),
        switchMap((action) => {
          let message = '';

          switch (action.type) {
            case TariffsActions.loadZonesFailure.type:
              message = 'Не удалось загрузить зоны отправки';
              break;

            case TariffsActions.loadZoneTariffsFailure.type:
              message = 'Не удалось загрузить тарифы для зоны отправки';
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
