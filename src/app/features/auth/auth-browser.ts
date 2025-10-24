import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, PLATFORM_ID, provideAppInitializer, TransferState } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, firstValueFrom, of, tap } from 'rxjs';

import { AUTH_TSTATE_KEY } from '@auth/auth-ssr';
import { AuthActions } from '@auth/store';
import type { AuthResponse } from '@auth/types';

export async function authBrowserInitializer() {
  const platformId = inject(PLATFORM_ID);
  const transfer = inject(TransferState);
  const http = inject(HttpClient);
  const store = inject(Store);

  if (!isPlatformBrowser(platformId)) return;

  const ssr = transfer.get(AUTH_TSTATE_KEY, null);
  if (ssr) {
    store.dispatch(AuthActions.initializeSuccess({ user: ssr.user }));
    transfer.remove(AUTH_TSTATE_KEY);
    return;
  }

  await firstValueFrom(
    http.get<AuthResponse>('/auth/me').pipe(
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
