import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TuiAlertService } from '@taiga-ui/core';
import { switchMap } from 'rxjs';

import { ModalService } from '@core/services/modal.service';

import { OrdersActions } from '../../store';

export const errorHandlingEffects = {
  errorHandling: createEffect(
    (
      actions$ = inject(Actions),
      modalService = inject(ModalService),
      alert = inject(TuiAlertService),
      transloco = inject(TranslocoService),
    ) => {
      return actions$.pipe(
        ofType(
          OrdersActions.loadListFailure,
          OrdersActions.loadDetailsFailure,
          OrdersActions.cancelFailure,
          OrdersActions.exportToExcelFailure,
        ),
        switchMap((action) => {
          let message = '';

          switch (action.type) {
            case OrdersActions.loadListFailure.type:
              message = 'Не удалось загрузить список заказов';
              break;

            case OrdersActions.loadDetailsFailure.type:
              message = 'Не удалось загрузить детали заказа';
              modalService.closeAllModals();
              break;

            case OrdersActions.cancelFailure.type:
              message = 'Не удалось отменить заказ';
              break;

            case OrdersActions.exportToExcelFailure.type:
              message = 'Ошибка при подготовке данных для экспорта';
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
