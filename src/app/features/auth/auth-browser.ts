import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, inject, PLATFORM_ID, TransferState } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, firstValueFrom, of, tap } from 'rxjs';

import { AUTH_TSTATE_KEY } from '@auth/auth-ssr';
import { AuthActions } from '@auth/store';
import type { AuthResponse } from '@auth/types';

export function authBrowserInitializer() {
  const platformId = inject(PLATFORM_ID);
  const transfer = inject(TransferState);
  const http = inject(HttpClient);
  const store = inject(Store);

  return async () => {
    if (!isPlatformBrowser(platformId)) return;

    const ssr = transfer.get(AUTH_TSTATE_KEY, null);
    if (ssr) {
      store.dispatch(AuthActions.initializeSuccess({ user: ssr.user }));
      transfer.remove(AUTH_TSTATE_KEY);
      return;
    }

    // await firstValueFrom(
    //   http.get('/auth/me').pipe(
    //     tap((resp: any) => {
    //       const user = (resp && (resp.user ?? resp)) as any;
    //       if (!user || (user as any).error) {
    //         store.dispatch(AuthActions.initializeFailure());
    //         return;
    //       }
    //       store.dispatch(AuthActions.initializeSuccess({ user }));
    //     }),
    //     catchError(() => {
    //       store.dispatch(AuthActions.initializeFailure());
    //       return of(null);
    //     }),
    //   ),
    // );

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
  };
}

export const AUTH_BROWSER_PROVIDERS = [
  { provide: APP_INITIALIZER, multi: true, useFactory: authBrowserInitializer },
];
