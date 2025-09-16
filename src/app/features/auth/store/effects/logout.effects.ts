import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { PersistenceService } from '@core/services';

import { TokenService } from '@auth/services/token.service';
import type { AuthResponse } from '@auth/types';

import { AuthActions } from '../actions';

export const logoutEffects = {
  logout: createEffect(
    (
      actions$ = inject(Actions),
      tokenService = inject(TokenService),
      persistenceService = inject(PersistenceService),
      router = inject(Router),
    ) => {
      return actions$.pipe(
        ofType(AuthActions.logout),
        map(() => {
          tokenService.clearTokens();
          persistenceService.remove<'user', { user: AuthResponse }>('user');
          router.navigate(['/auth/login']);
        }),
      );
    },
    { functional: true, dispatch: false },
  ),

  // logout: createEffect(
  //   (actions$ = inject(Actions), authService = inject(AuthService)) => {
  //     return actions$.pipe(
  //       ofType(AuthActions.logout),
  //       switchMap(() =>
  //         authService.logout().pipe(
  //           mapResponse({
  //             next: () => AuthActions.logoutSuccess(),
  //             error: (error: ApiError) => AuthActions.logoutFailure({ error }),
  //           }),
  //         ),
  //       ),
  //     );
  //   },
  //   { functional: true },
  // ),
  //
  // redirectAfterLogout: createEffect(
  //   (actions$ = inject(Actions), router = inject(Router)) => {
  //     return actions$.pipe(
  //       ofType(AuthActions.logoutSuccess),
  //       tap(() => {
  //         router.navigate(['/auth/login']);
  //       }),
  //     );
  //   },
  //   { functional: true, dispatch: false },
  // ),
};
