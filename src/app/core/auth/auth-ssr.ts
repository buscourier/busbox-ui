import { isPlatformServer } from '@angular/common';
import {
  inject,
  makeStateKey,
  PLATFORM_ID,
  provideAppInitializer,
  TransferState,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, firstValueFrom, of, tap } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthActions } from './store';
import type { AuthResponse } from './types';

export const AUTH_TSTATE_KEY = makeStateKey<{ user: AuthResponse }>('AUTH_SSR');

export async function authSsrInitializer() {
  const platformId = inject(PLATFORM_ID);
  const store = inject(Store);
  const auth = inject(AuthService);
  const transfer = inject(TransferState);

  if (!isPlatformServer(platformId)) return;

  await firstValueFrom(
    auth.getCurrentUser().pipe(
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
}

export const AUTH_SSR_PROVIDERS = [provideAppInitializer(authSsrInitializer)];
