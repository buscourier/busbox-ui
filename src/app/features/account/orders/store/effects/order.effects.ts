import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { OrdersService } from '../../services/orders.service';

import { OrdersActions } from '../actions';

export const orderEffects = {
  loadOrder: createEffect(
    (actions$ = inject(Actions), ordersService = inject(OrdersService)) => {
      return actions$.pipe(
        ofType(OrdersActions.getOrder),
        switchMap(({ orderId }) =>
          ordersService.getOrder(orderId).pipe(
            mapResponse({
              next: (details) => OrdersActions.getOrderSuccess({ details }),
              error: (error: ApiError) => OrdersActions.getOrderFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
  cancelOrder: createEffect(
    (actions$ = inject(Actions), ordersService = inject(OrdersService)) => {
      return actions$.pipe(
        ofType(OrdersActions.cancelOrder),
        switchMap(({ payload }) =>
          ordersService.cancelOrder(payload).pipe(
            mapResponse({
              next: (response) => OrdersActions.cancelOrderSuccess({ response }),
              error: (error: ApiError) => OrdersActions.cancelOrderFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
