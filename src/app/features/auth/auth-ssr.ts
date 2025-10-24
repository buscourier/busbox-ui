import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, inject, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, firstValueFrom, of, tap } from 'rxjs';

import { AuthActions } from '@auth/store';
import type { AuthResponse } from '@auth/types';

export const AUTH_TSTATE_KEY = makeStateKey<{ user: AuthResponse }>('AUTH_SSR');

export function authSsrInitializer() {
  const platformId = inject(PLATFORM_ID);
  const http = inject(HttpClient);
  const store = inject(Store);
  const transfer = inject(TransferState);

  return async () => {
    if (!isPlatformServer(platformId)) return;

    // await firstValueFrom(
    //   http.get('/auth/me').pipe(
    //     tap((resp: any) => {
    //       console.log('reeesp', resp);
    //
    //       // приводим payload к виду { user } и валидируем ответ
    //       const user = (resp && (resp.user ?? resp)) as any;
    //       if (!user || (user as any).error) {
    //         store.dispatch(AuthActions.initializeFailure());
    //         return;
    //       }
    //       transfer.set(AUTH_TSTATE_KEY, { user });
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
          transfer.set(AUTH_TSTATE_KEY, { user });
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

export const AUTH_SSR_PROVIDERS = [
  { provide: APP_INITIALIZER, multi: true, useFactory: authSsrInitializer },
];
