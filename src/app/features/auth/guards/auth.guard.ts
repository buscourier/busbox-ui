import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { map } from 'rxjs/operators';

import { selectIsAuthenticated } from '../store';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        const currentUrl = state.url;
        const isAuthRoute = currentUrl.startsWith('/auth/');

        if (!isAuthRoute) {
          router.navigate(['/auth/login'], { queryParams: { returnUrl: currentUrl } });
        } else {
          router.navigate(['/auth/login']);
        }
        return false;
      }
      return true;
    }),
  );
};
