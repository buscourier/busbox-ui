import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { filter, of, switchMap } from 'rxjs';

import { AuthFacade } from '@core/auth';

import type { ApiError } from '@shared/types';

import { OrdersService } from '../../services/orders.service';
import type { CancelOrderPayload } from '../../types';

import { OrdersActions } from '../actions';

export const orderEffects = {
  loadOrderDetails: createEffect(
    (actions$ = inject(Actions), ordersService = inject(OrdersService)) => {
      return actions$.pipe(
        ofType(OrdersActions.loadDetails),
        switchMap(({ orderId }) =>
          ordersService.getOrder(orderId).pipe(
            mapResponse({
              next: (data) => OrdersActions.loadDetailsSuccess({ data }),
              error: (error: ApiError) => OrdersActions.loadDetailsFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
  cancelOrder: createEffect(
    (
      actions$ = inject(Actions),
      auth = inject(AuthFacade),
      ordersService = inject(OrdersService),
    ) => {
      return actions$.pipe(
        ofType(OrdersActions.cancelOrder),
        concatLatestFrom(() => auth.currentUser$),
        filter(([, user]) => !!user),
        switchMap(([{ orderId }, user]) => {
          if (!orderId) {
            return of(
              OrdersActions.cancelOrderFailure({
                error: { message: 'Order ID is required' } as ApiError,
              }),
            );
          }

          const payload: CancelOrderPayload = {
            'user-id': user!.id,
            'order-id': orderId,
          };

          return ordersService.cancelOrder(payload).pipe(
            mapResponse({
              next: (response) => OrdersActions.cancelOrderSuccess({ response }),
              error: (error: ApiError) => OrdersActions.cancelOrderFailure({ error }),
            }),
          );
        }),
      );
    },
    { functional: true },
  ),
};
