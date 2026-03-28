import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { NotificationsActions } from '@core/notifications';
import { ModalService } from '@core/services/modal.service';

import { OrdersActions } from '../../store';

export const errorHandlingEffects = {
  errorHandling: createEffect(
    (actions$ = inject(Actions), modalService = inject(ModalService)) => {
      return actions$.pipe(
        ofType(
          OrdersActions.loadListFailure,
          OrdersActions.loadDetailsFailure,
          OrdersActions.cancelOrderFailure,
          OrdersActions.exportListFailure,
        ),
        map((action) => {
          let message = '';

          switch (action.type) {
            case OrdersActions.loadListFailure.type:
              message = 'Не удалось загрузить список заказов';
              break;

            case OrdersActions.loadDetailsFailure.type:
              message = 'Не удалось загрузить детали заказа';
              modalService.closeAllModals();
              break;

            case OrdersActions.cancelOrderFailure.type:
              message = 'Не удалось отменить заказ';
              break;

            case OrdersActions.exportListFailure.type:
              message = 'Ошибка при подготовке данных для экспорта';
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
