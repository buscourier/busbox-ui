import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { filter, first, of, switchMap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { AuthFacade } from '@auth';

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
      authFacade = inject(AuthFacade),
      ordersService = inject(OrdersService),
    ) => {
      return actions$.pipe(
        ofType(OrdersActions.cancel),
        switchMap(({ orderId }) =>
          authFacade.getCurrentUser().pipe(
            filter((user) => !!user),
            first(),
            switchMap((user) => {
              if (!orderId) {
                return of(
                  OrdersActions.cancelFailure({
                    error: { message: 'Order ID is required' } as ApiError,
                  }),
                );
              }

              const payload: CancelOrderPayload = {
                'user-id': user.id,
                'order-id': orderId,
              };

              return ordersService.cancelOrder(payload).pipe(
                mapResponse({
                  next: (response) => OrdersActions.cancelSuccess({ response }),
                  error: (error: ApiError) => OrdersActions.cancelFailure({ error }),
                }),
              );
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
