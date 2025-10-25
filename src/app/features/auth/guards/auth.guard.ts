import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { selectAuthState } from '../store';

// export const authGuard: CanActivateFn = (route, state) => {
//   const store = inject(Store);
//   const router = inject(Router);
//
//   return store.select(selectIsAuthenticated).pipe(
//     take(1),
//     map((isAuthenticated) => {
//       if (!isAuthenticated) {
//         const currentUrl = state.url;
//         const isAuthRoute = currentUrl.startsWith('/auth/');
//
//         if (!isAuthRoute) {
//           router.navigate(['/auth/login'], { queryParams: { returnUrl: currentUrl } });
//         } else {
//           router.navigate(['/auth/login']);
//         }
//         return false;
//       }
//       return true;
//     }),
//   );
// };

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // На сервере не выполняем редирект, чтобы избежать мигания страницы авторизации при SSR
  if (isPlatformServer(platformId)) {
    return true;
  }

  return store.select(selectAuthState).pipe(
    filter((authState) => authState.isInitialized),
    take(1),
    map((authState) => {
      if (!authState.isAuthenticated) {
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
      return true;
    }),
  );
};
