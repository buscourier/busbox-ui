import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { map } from 'rxjs/operators';

import { selectIsAuthenticated } from '../store';

/**
 * Guard to prevent authenticated users from accessing login/register pages
 */
export const noAuthGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      console.log('isAuthenticated', isAuthenticated);
      if (isAuthenticated) {
        const returnUrl = route.queryParams['returnUrl'] || '/';
        router.navigate([returnUrl]);
        return false;
      }
      return true; // Access for non authenticated users
    }),
  );
};
