import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap, tap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { AuthService } from '../../services/auth.service';

import { AuthActions } from '../actions';

export const passwordEffects = {
  forgotPassword: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.forgotPassword),
        switchMap(({ email }) =>
          authService.forgotPassword(email).pipe(
            mapResponse({
              next: (response) => AuthActions.forgotPasswordSuccess({ message: response.message }),
              error: (error: ApiError) => AuthActions.forgotPasswordFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true, dispatch: false },
  ),
  resetPassword: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.resetPassword),
        switchMap(({ payload }) =>
          authService.resetPassword(payload).pipe(
            mapResponse({
              next: (payload) => AuthActions.resetPasswordSuccess({ message: payload.message }),
              error: (error: ApiError) => AuthActions.resetPasswordFailure({ error: error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
  redirectAfterResetPassword: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(AuthActions.resetPasswordSuccess),
        tap(() => {
          router.navigate(['/auth/login']);
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
