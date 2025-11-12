import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap, tap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { AuthService } from '../../services/auth.service';

import { AuthActions } from '../actions';

export const loginEffects = {
  login: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.login),
        switchMap(({ credentials }) =>
          authService.login(credentials).pipe(
            mapResponse({
              next: (user) => AuthActions.loginSuccess({ user }),
              error: (error: ApiError) => AuthActions.loginFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),

  // loginSuccess: createEffect(
  //   (
  //     actions$ = inject(Actions),
  //     tokenService = inject(TokenService),
  //     persistenceService = inject(PersistenceService),
  //   ) => {
  //     return actions$.pipe(
  //       ofType(AuthActions.loginSuccess),
  //       tap(({ response }) => {
  //         tokenService.setTokens(response.auth_key);
  //         persistenceService.save<'user', { user: AuthResponse }>('user', response);
  //       }),
  //     );
  //   },
  //   { functional: true, dispatch: false },
  // ),

  redirectAfterLogin: createEffect(
    (actions$ = inject(Actions), router = inject(Router), route = inject(ActivatedRoute)) => {
      return actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          const returnUrl = route.snapshot.queryParams['returnUrl'] || '/';
          router.navigateByUrl(returnUrl);
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
