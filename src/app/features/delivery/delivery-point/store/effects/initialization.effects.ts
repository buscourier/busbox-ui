import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { PersistenceService } from '@core/services';

import { deliveryPointFeature } from '@delivery/delivery-point';
import { initPickupPoint } from '@delivery/pickup-point';
import type { DeliveryStorageKey, DeliveryStorageSchema } from '@delivery/types';
import { canInitializeFromUrl } from '@delivery/utils';

import { DeliveryPointActions } from '../actions';

export const initializationEffects = {
  initState: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(initPickupPoint),
        map(() => DeliveryPointActions.initState()),
      );
    },
    { functional: true },
  ),
  loadState: createEffect(
    (actions$ = inject(Actions), persistenceService = inject(PersistenceService)) => {
      return actions$.pipe(
        ofType(DeliveryPointActions.initState),
        map(() => {
          const restoredState = persistenceService.load<DeliveryStorageKey, DeliveryStorageSchema>(
            'deliveryPoint',
          );

          return restoredState
            ? DeliveryPointActions.restoreState({
                restoredState: restoredState as DeliveryStorageSchema['deliveryPoint'],
              })
            : DeliveryPointActions.initSkipped();
        }),
      );
    },
    { functional: true },
  ),

  initializeCityFromUrl: createEffect(
    (actions$ = inject(Actions), route = inject(ActivatedRoute)) => {
      return actions$.pipe(
        ofType(DeliveryPointActions.loadCitiesSuccess),
        filter(() => canInitializeFromUrl(route)),
        map(({ cities }) => {
          const pickupCityId = route.snapshot.queryParams['deliveryCityId'];

          return cities.find((city) => city.id === pickupCityId);
        }),
        filter(Boolean),
        map((city) => DeliveryPointActions.selectCity({ city })),
      );
    },
    { functional: true },
  ),

  // Final step of initialization if data init from queryParams
  // If delivery city selected, then all sequence success, and now we can remove query params
  deleteQueryParamsAfterInitialize: createEffect(
    (
      actions$ = inject(Actions),
      store = inject(Store),
      router = inject(Router),
      route = inject(ActivatedRoute),
    ) => {
      return actions$.pipe(
        ofType(DeliveryPointActions.selectCity),
        filter(() => canInitializeFromUrl(route)),
        withLatestFrom(store.select(deliveryPointFeature.selectSelectedCity)),
        filter(Boolean),
        tap(() => {
          router.navigate([], {
            queryParams: {},
            replaceUrl: true,
          });
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
