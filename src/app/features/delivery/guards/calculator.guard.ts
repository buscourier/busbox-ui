import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, CanActivateFn, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';

import { DeliveryActions } from '@delivery/store';

const hasValue = (v: string | null | undefined) => !!v && v.trim().length > 0;

export const calculatorGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | UrlTree => {
  const store = inject(Store);

  const pickupCityId = route.queryParamMap.get('pickupCityId');
  const deliveryCityId = route.queryParamMap.get('deliveryCityId');

  if (hasValue(pickupCityId) && hasValue(deliveryCityId)) {
    store.dispatch(DeliveryActions.resetDelivery());
  }

  return true;
};
