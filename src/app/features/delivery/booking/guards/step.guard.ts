import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, CanActivateFn, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { bookingFeature } from '../store';
import type { StepNumber } from '../types';

export const stepGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);

  const stepNumber = getStepNumber(route.url[0].path);

  return combineLatest([
    store.select(bookingFeature.selectCanAccessStep(stepNumber)),
    store.select(bookingFeature.selectIsLegalEntity),
  ]).pipe(
    map(([canAccess, isLegal]) => {
      if (isLegal && stepNumber === 1) {
        return router.createUrlTree(['/delivery/booking/departure']);
      }

      if (!canAccess) {
        const defaultStep = isLegal ? '/delivery/booking/departure' : '/delivery/booking/applicant';
        return router.createUrlTree([defaultStep]);
      }

      return true;
    }),
  );
};

function getStepNumber(path: string): StepNumber {
  const pathToStep: Record<string, StepNumber> = {
    applicant: 1,
    departure: 2,
    destination: 3,
    review: 4,
  };

  return pathToStep[path] || 1;
}
