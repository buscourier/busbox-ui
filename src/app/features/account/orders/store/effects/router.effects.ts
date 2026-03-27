import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import type { Action } from '@ngrx/store';
import { concatMap, EMPTY, filter, of, switchMap, take } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocationsFacade } from '@store';

// eslint-disable-next-line import/no-internal-modules
import { LocationsActions } from '@store/locations/actions';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants';
import { type Filter, type Order, type SortConfig, stringToSortDirection } from '../../types';

import { OrdersActions } from '../actions';

export const routerEffects = {
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
          const {
            from: pickupCityId,
            to: deliveryCityId,
            range,
            page,
            size: pageSize,
            sortField,
            sortDirection,
          } = params;

          const actions: Action[] = [];

          if (sortField && sortDirection) {
            const sort: SortConfig = {
              field: sortField as keyof Order,
              direction: stringToSortDirection(sortDirection),
            };

            actions.push(OrdersActions.setSort({ sort }));
          } else {
            actions.push(OrdersActions.clearSort());
          }

          actions.push(OrdersActions.setPage({ page: page || DEFAULT_PAGE }));
          actions.push(OrdersActions.setPageSize({ pageSize: pageSize || DEFAULT_PAGE_SIZE }));

          if (!pickupCityId && !deliveryCityId && !range) {
            actions.unshift(OrdersActions.clearFilter());
            return of(...actions);
          }

          if (!pickupCityId && !deliveryCityId && range) {
            const filter: Filter = {
              pickupCity: null,
              deliveryCity: null,
              range: range || '',
            };
            actions.unshift(OrdersActions.setFilter({ filter }));
            return of(...actions);
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

                  actions.unshift(OrdersActions.setFilter({ filter }));
                  return of(...actions);
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
