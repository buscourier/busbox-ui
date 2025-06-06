import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import {
  concatMap,
  distinctUntilChanged,
  EMPTY,
  filter,
  first,
  of,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { isObjectsEqual } from '@core/utils';

import { LocationsFacade } from '@shared/store';
// eslint-disable-next-line import/no-internal-modules
import { LocationsActions } from '@shared/store/locations/actions';
import type { ApiError } from '@shared/types';

import { ordersFeature } from '@account/orders';
import { AuthFacade } from '@auth';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants';
import { OrdersService } from '../../services/orders.service';
import type { Filter, OrderListPayload } from '../../types';

import { OrdersActions } from '../actions';

export const orderListEffects = {
  setPayload: createEffect(
    (actions$ = inject(Actions), store = inject(Store), authFacade = inject(AuthFacade)) => {
      return actions$.pipe(
        ofType(OrdersActions.applyFilter, OrdersActions.setCurrentPage, OrdersActions.setPageSize),
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

  initFromRoute: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        filter((action) => action.payload.routerState.url.includes('/account/orders')),
        map((action) => action.payload.routerState.root.queryParams),
        map((params) => {
          return OrdersActions.restoreFromUrl({ params });
        }),
        // catchError(error => {
        //   console.error('Router navigation error:', error);
        //   return of(OrdersActions.restoreFromUrlFailure({ error }));
        // })
      );
    },
    { functional: true },
  ),

  restoreFromUrl: createEffect(
    (actions$ = inject(Actions), locationsFacade = inject(LocationsFacade)) => {
      return actions$.pipe(
        ofType(OrdersActions.restoreFromUrl),
        switchMap(({ params }) => {
          const { from: pickupCityId, to: deliveryCityId, range, page, size: pageSize } = params;

          // Pagination without filters
          if (!pickupCityId && !deliveryCityId && !range) {
            return of(
              OrdersActions.clearFilter(),
              OrdersActions.setCurrentPage({ page: page || DEFAULT_PAGE }),
              OrdersActions.setPageSize({ pageSize: pageSize || DEFAULT_PAGE_SIZE }),
            );
          }

          // Pagination with date range
          if (!pickupCityId && !deliveryCityId && range) {
            const filter: Filter = {
              pickupCity: null,
              deliveryCity: null,
              range: range || '',
            };

            return of(
              OrdersActions.applyFilter({ filter }),
              OrdersActions.setCurrentPage({ page: page || DEFAULT_PAGE }),
              OrdersActions.setPageSize({ pageSize: pageSize || DEFAULT_PAGE_SIZE }),
            );
          }

          if (!pickupCityId) return EMPTY;

          return locationsFacade.getPickupCities().pipe(
            switchMap((pickupCities) => {
              const pickupCity = pickupCities.find((city) => city.id === pickupCityId);

              if (!pickupCity) {
                console.warn(`Pickup city with id ${pickupCityId} not found`);
                return EMPTY;
              }

              locationsFacade.loadDeliveryCities(pickupCityId);

              return actions$.pipe(
                ofType(LocationsActions.loadDeliveryCitiesSuccess),
                take(1),
                concatMap(({ cities: deliveryCities }) => {
                  const deliveryCity = deliveryCityId
                    ? deliveryCities.find((city) => city.id === deliveryCityId) || null
                    : null;

                  if (deliveryCityId && !deliveryCity) {
                    console.warn(`Delivery city with id ${deliveryCityId} not found`);
                  }

                  const filter: Filter = {
                    pickupCity,
                    deliveryCity,
                    range: range || '',
                  };

                  return of(
                    OrdersActions.applyFilter({ filter }),
                    OrdersActions.setCurrentPage({ page: page || DEFAULT_PAGE }),
                    OrdersActions.setPageSize({ pageSize: pageSize || DEFAULT_PAGE_SIZE }),
                  );
                }),
              );
            }),
          );
        }),
      );
    },
    { functional: true },
  ),
};
