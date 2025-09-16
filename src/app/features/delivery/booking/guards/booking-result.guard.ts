import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, CanActivateFn, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { bookingFeature } from '../store';

export const bookingResultGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);

  const isSuccessPage = route.routeConfig?.path === 'success';
  const selector = isSuccessPage
    ? bookingFeature.selectIsBookingSuccess
    : bookingFeature.selectIsBookingFailed;

  return store.select(selector).pipe(
    take(1),
    map((canAccess) => {
      if (canAccess) {
        return true;
      }

      return router.createUrlTree(['/delivery/booking/applicant']);
    }),
  );
};
