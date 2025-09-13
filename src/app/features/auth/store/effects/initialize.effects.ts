import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { PersistenceService } from '@core/services';

import { TokenService } from '@auth/services/token.service';
import { AuthActions } from '@auth/store';
import type { AuthResponse } from '@auth/types';

export const initializeEffects = {
  initialize: createEffect(
    (
      actions$ = inject(Actions),
      tokenService = inject(TokenService),
      persistenceService = inject(PersistenceService),
    ) => {
      return actions$.pipe(
        ofType(AuthActions.initialize),
        map(() => {
          const token = tokenService.getAccessToken();
          const user = persistenceService.load<'user', { user: AuthResponse }>('user');

          if (!token || !tokenService.isAuthenticated() || !user) {
            tokenService.clearTokens();
            persistenceService.remove<'user', { user: AuthResponse }>('user');
            return AuthActions.initializeFailure();
          }

          try {
            return AuthActions.initializeSuccess({ user });
          } catch {
            return AuthActions.initializeFailure();
          }
        }),
      );
    },
    { functional: true },
  ),
};
