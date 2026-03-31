import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, provideAppInitializer, TransferState } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, firstValueFrom, of, tap } from 'rxjs';

import { AUTH_TSTATE_KEY } from './auth-ssr';
import { AuthService } from './auth.service';
import { AuthActions } from './store';

export async function authBrowserInitializer() {
  const platformId = inject(PLATFORM_ID);
  const transfer = inject(TransferState);
  const store = inject(Store);
  const auth = inject(AuthService);

  if (!isPlatformBrowser(platformId)) return;

  const ssr = transfer.get(AUTH_TSTATE_KEY, null);
  if (ssr) {
    store.dispatch(AuthActions.initializeSuccess({ user: ssr.user }));
    transfer.remove(AUTH_TSTATE_KEY);
    return;
  }

  await firstValueFrom(
    auth.getCurrentUser().pipe(
      tap((user) => {
        store.dispatch(AuthActions.initializeSuccess({ user }));
      }),
      catchError(() => {
        store.dispatch(AuthActions.initializeFailure());
        return of(null);
      }),
    ),
  );
}

export const AUTH_BROWSER_PROVIDERS = [provideAppInitializer(authBrowserInitializer)];
