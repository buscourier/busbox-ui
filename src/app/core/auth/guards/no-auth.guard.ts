import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { selectAuthState } from '../store';

/**
 * Guard to prevent authenticated users from accessing login/register pages
 */

export const noAuthGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    return true;
  }

  return store.select(selectAuthState).pipe(
    filter((authState) => authState.isInitialized),
    take(1),
    map((authState) => {
      if (authState.isAuthenticated) {
        const returnUrl = route.queryParams['returnUrl'] || '/';
        router.navigateByUrl(returnUrl);
        return false;
      }
      return true;
    }),
  );
};
