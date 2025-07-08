import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { catchError, EMPTY, filter, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocationsFacade } from '@shared/store';

import { TariffsActions } from '../actions';

export const routerEffects = {
  initFromRoute: createEffect(
    (actions$ = inject(Actions), locationsFacade = inject(LocationsFacade)) => {
      return actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        filter((action) => action.payload.routerState.url.includes('/tariffs')),
        map((action) => action.payload.routerState.root.queryParams['cityId']),
        filter(Boolean),
        switchMap((cityId) =>
          locationsFacade.getPickupCities().pipe(
            // take(1),
            map((cities) => cities.find((city) => city.id === cityId)),
            filter(Boolean),
            map((city) => TariffsActions.selectCity({ city })),
            catchError(() => EMPTY),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
