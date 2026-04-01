import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthFacade } from '@core/auth';

import type { ApiError } from '@shared/types';

import { ordersFeature } from '@account/orders';

import { OrdersService } from '../../services/orders.service';
import type { OrderListPayload } from '../../types';

import { OrdersActions } from '../actions';

export const orderListEffects = {
  setPayload: createEffect(
    (actions$ = inject(Actions), store = inject(Store), auth = inject(AuthFacade)) => {
      return actions$.pipe(
        ofType(
          OrdersActions.setFilter,
          OrdersActions.setPage,
          OrdersActions.setPageSize,
          OrdersActions.setSort,
          OrdersActions.clearSort,
        ),
        concatLatestFrom(() => [
          auth.currentUser$,
          store.select(ordersFeature.selectFilter),
          store.select(ordersFeature.selectPagination),
          store.select(ordersFeature.selectSort),
        ]),
        filter(([, user]) => !!user),
        map(([, user, filter, pagination, sort]) => {
          const { currentPage, pageSize } = pagination;

          const payload: OrderListPayload = {
            'user-id': user!.id,
            'page-num': currentPage.toString(),
            'elements-on-page': pageSize.toString(),
            ...(filter.range && {
              'start-date': filter.range.split(',')[0],
              'end-date': filter.range.split(',')[1],
            }),
            ...(filter.pickupCity && { 'start-city': filter.pickupCity.id }),
            ...(filter.deliveryCity && { 'end-city': filter.deliveryCity.id }),
            ...(sort.field &&
              sort.direction !== 0 && {
                'sort-field': sort.field,
                'sort-direction': sort.direction === 1 ? 'asc' : 'desc',
              }),
          };

          return OrdersActions.loadList({ payload });
        }),
      );
    },
    { functional: true },
  ),

  loadList: createEffect(
    (actions$ = inject(Actions), ordersService = inject(OrdersService)) => {
      return actions$.pipe(
        ofType(OrdersActions.loadList),
        // distinctUntilChanged((prev, curr) => isObjectsEqual(prev, curr)),
        switchMap(({ payload }) =>
          ordersService.getOrderList(payload).pipe(
            mapResponse({
              next: (response) => OrdersActions.loadListSuccess({ response }),
              error: (error: ApiError) => OrdersActions.loadListFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
