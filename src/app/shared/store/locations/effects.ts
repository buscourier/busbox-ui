import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';

import { ApiService } from '@core/services';

import type { ApiError } from '@shared/types';

import { LocationsActions } from './actions';

export const LocationsEffects = {
  loadPickupCities: createEffect(
    (actions$ = inject(Actions), apiService = inject(ApiService)) => {
      return actions$.pipe(
        ofType(LocationsActions.loadPickupCities),
        switchMap(() =>
          apiService.getPickupCities().pipe(
            mapResponse({
              next: (cities) => LocationsActions.loadPickupCitiesSuccess({ cities }),
              error: (error: ApiError) => LocationsActions.loadPickupCitiesFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
  loadDeliveryCities: createEffect(
    (actions$ = inject(Actions), apiService = inject(ApiService)) => {
      return actions$.pipe(
        ofType(LocationsActions.loadDeliveryCities),
        switchMap(({ pickupCityId }) =>
          apiService.getDeliveryCities(pickupCityId).pipe(
            mapResponse({
              next: (cities) => LocationsActions.loadDeliveryCitiesSuccess({ cities }),
              error: (error: ApiError) => LocationsActions.loadDeliveryCitiesFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
  offices: createEffect(
    (actions$ = inject(Actions), apiService = inject(ApiService)) => {
      return actions$.pipe(
        ofType(LocationsActions.loadOffices),
        switchMap(() =>
          apiService.getOffices().pipe(
            mapResponse({
              next: (offices) => LocationsActions.loadOfficesSuccess({ offices }),
              error: (error: ApiError) => LocationsActions.loadOfficesFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
