import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationsActions } from '@core/notifications';
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
  onLoadFailure: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(
          LocationsActions.loadPickupCitiesFailure,
          LocationsActions.loadDeliveryCitiesFailure,
          LocationsActions.loadOfficesFailure,
        ),
        map((action) => {
          const message = getDefaultErrorMessage(action.type);
          return NotificationsActions.showError({
            message,
          });
        }),
      );
    },
    { functional: true },
  ),
};

function getDefaultErrorMessage(actionType: string): string {
  const messages: Record<string, string> = {
    [LocationsActions.loadPickupCitiesFailure.type]: 'Не удалось загрузить города отправления',
    [LocationsActions.loadDeliveryCitiesFailure.type]: 'Не удалось загрузить города получения',
    [LocationsActions.loadOfficesFailure.type]: 'Не удалось загрузить офисы',
  };

  return messages[actionType] || 'Произошла ошибка при загрузке данных';
}
