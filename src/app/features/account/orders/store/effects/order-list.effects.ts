import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, first, switchMap, withLatestFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { isObjectsEqual } from '@core/utils';

import type { ApiError } from '@shared/types';

import { ordersFeature } from '@account/orders';
import { AuthFacade } from '@auth';

import { OrdersService } from '../../services/orders.service';
import type { OrderListPayload } from '../../types';

import { OrdersActions } from '../actions';

export const orderListEffects = {
  setPayload: createEffect(
    (actions$ = inject(Actions), store = inject(Store), authFacade = inject(AuthFacade)) => {
      return actions$.pipe(
        ofType(OrdersActions.setFilter, OrdersActions.setCurrentPage, OrdersActions.setPageSize),
        switchMap(() =>
          authFacade.getCurrentUser().pipe(
            filter((user) => !!user),
            first(),
            withLatestFrom(
              store.select(ordersFeature.selectFilter),
              store.select(ordersFeature.selectCurrentPage),
              store.select(ordersFeature.selectPageSize),
            ),
            map(([user, filter, currentPage, pageSize]) => {
              const payload: OrderListPayload = {
                'user-id': user.id,
                'page-num': currentPage.toString(),
                'elements-on-page': pageSize.toString(),
                ...(filter.range && {
                  'start-date': filter.range.split(',')[0],
                  'end-date': filter.range.split(',')[1],
                }),
                ...(filter.pickupCity && { 'start-city': filter.pickupCity.id }),
                ...(filter.deliveryCity && { 'end-city': filter.deliveryCity.id }),
              };

              return OrdersActions.getOrderList({ payload });
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),

  loadList: createEffect(
    (actions$ = inject(Actions), ordersService = inject(OrdersService)) => {
      return actions$.pipe(
        ofType(OrdersActions.getOrderList),
        distinctUntilChanged((prev, curr) => isObjectsEqual(prev, curr)),
        switchMap(({ payload }) =>
          ordersService.getOrderList(payload).pipe(
            mapResponse({
              next: (response) => OrdersActions.getOrderListSuccess({ response }),
              error: (error: ApiError) => OrdersActions.getOrderListFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
