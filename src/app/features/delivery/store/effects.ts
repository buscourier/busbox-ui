import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, type RouterNavigationAction } from '@ngrx/router-store';
import { filter } from 'rxjs';
import { map } from 'rxjs/operators';

import { DeliveryActions } from './actions';

export const DeliveryEffects = {
  resetOnCalculatorWithParams: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        filter((action: RouterNavigationAction) => {
          const routerState = action.payload.routerState;
          const isCalculatorPage = routerState.url.startsWith('/delivery/calculator');
          const hasRequiredParams = !!(
            routerState.root.queryParams['pickupCityId'] &&
            routerState.root.queryParams['deliveryCityId']
          );

          return isCalculatorPage && hasRequiredParams;
        }),
        map(() => DeliveryActions.resetDelivery()),
      );
    },
    { functional: true },
  ),
};
