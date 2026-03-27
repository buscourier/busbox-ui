import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { NotificationsActions } from '@core/notifications';

import { TariffsActions } from '../actions';

export const errorHandlingEffects = {
  onLoadFailure: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(TariffsActions.loadZonesFailure, TariffsActions.loadZoneTariffsFailure),
        map((action) => {
          let message = '';

          switch (action.type) {
            case TariffsActions.loadZonesFailure.type:
              message = 'Не удалось загрузить зоны отправки';
              break;

            case TariffsActions.loadZoneTariffsFailure.type:
              message = 'Не удалось загрузить тарифы для зоны отправки';
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
