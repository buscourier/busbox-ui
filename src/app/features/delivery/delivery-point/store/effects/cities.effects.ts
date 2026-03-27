import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { filter, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationsActions } from '@core/notifications';

import type { ApiError, DeliveryCity } from '@shared/types';

import { restorePickupPointState, selectPickupPointCity } from '@delivery/pickup-point';
import { DeliveryService } from '@delivery/services';

import { DeliveryPointActions } from '../actions';

export const citiesEffects = {
  initCitiesLoad: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(selectPickupPointCity),
        map(({ city }) => DeliveryPointActions.loadCities({ startCityId: city.id })),
      );
    },
    { functional: true },
  ),
  initCitiesLoadOnPickupPointRestore: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(restorePickupPointState),
        filter(({ restoredState }) => !!restoredState.cities?.selected),
        map(({ restoredState }) =>
          DeliveryPointActions.loadCities({ startCityId: restoredState.cities.selected!.id }),
        ),
      );
    },
    { functional: true },
  ),
  loadDeliveryCities: createEffect(
    (actions$ = inject(Actions), deliveryService = inject(DeliveryService)) => {
      return actions$.pipe(
        ofType(DeliveryPointActions.loadCities),
        switchMap(({ startCityId }) =>
          deliveryService.getDeliveryCities(startCityId).pipe(
            mapResponse({
              next: (cities: DeliveryCity[]) => DeliveryPointActions.loadCitiesSuccess({ cities }),
              error: (error: ApiError) => DeliveryPointActions.loadCitiesFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
  onLoadCitiesFailure: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(DeliveryPointActions.loadCitiesFailure),
        map(() => {
          return NotificationsActions.showError({
            message: 'Не удалось загрузить города получения',
          });
        }),
      );
    },
    { functional: true },
  ),
};
