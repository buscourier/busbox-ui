import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { PersistenceService } from '@core/services';

import type { DeliveryStorageKey, DeliveryStorageSchema } from '@delivery/types';
import { canInitializeFromUrl } from '@delivery/utils';

import { PickupPointActions } from '../actions';

export const initializationEffects = {
  restoreState: createEffect(
    (actions$ = inject(Actions), persistenceService = inject(PersistenceService)) => {
      return actions$.pipe(
        ofType(PickupPointActions.initState),
        map(() => {
          const restoredState = persistenceService.load<DeliveryStorageKey, DeliveryStorageSchema>(
            'pickupPoint',
          );
          return restoredState
            ? PickupPointActions.restoreState({
                restoredState: restoredState as DeliveryStorageSchema['pickupPoint'],
              })
            : PickupPointActions.initSkipped();
        }),
      );
    },
    { functional: true },
  ),

  initCitiesLoading: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(PickupPointActions.initState),
        map(() => PickupPointActions.loadCities()),
      );
    },
    { functional: true },
  ),

  initializeCityFromUrl: createEffect(
    (actions$ = inject(Actions), route = inject(ActivatedRoute)) => {
      return actions$.pipe(
        ofType(PickupPointActions.loadCitiesSuccess),
        filter(() => canInitializeFromUrl(route)),
        delay(0),
        map(({ cities }) => {
          const pickupCityId = route.snapshot.queryParams['pickupCityId'];

          return cities.find((city) => city.id === pickupCityId);
        }),
        filter(Boolean),
        map((city) => PickupPointActions.selectCity({ city })),
      );
    },
    { functional: true },
  ),
};
