import { inject } from '@angular/core';
import { Router } from '@angular/router';
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
              next: (response) => AuthActions.loginSuccess({ response }),
              error: (error: ApiError) => AuthActions.loginFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),

  redirectAfterLogin: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          router.navigate(['/']);
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
