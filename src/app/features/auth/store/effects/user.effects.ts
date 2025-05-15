import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { of, switchMap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

import { AuthActions } from '../actions';

export const userEffects = {
  getCurrentUser: createEffect(
    (
      actions$ = inject(Actions),
      authService = inject(AuthService),
      tokenService = inject(TokenService),
    ) => {
      return actions$.pipe(
        ofType(AuthActions.getCurrentUser),
        switchMap(() => {
          const accessToken = tokenService.getAccessToken();

          if (!accessToken) {
            return of(AuthActions.logoutSuccess());
          }

          return authService.getCurrentUser(accessToken).pipe(
            mapResponse({
              next: (user) => {
                if (user) {
                  return AuthActions.getCurrentUserSuccess({ user });
                }

                return AuthActions.getCurrentUserFailure({ error: { message: 'User not found' } });
              },
              error: (error: ApiError) => AuthActions.getCurrentUserFailure({ error }),
            }),
          );
        }),
      );
    },
    { functional: true },
  ),
};
