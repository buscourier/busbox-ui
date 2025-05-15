import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap, tap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { AuthService } from '../../services/auth.service';

import { AuthActions } from '../actions';

export const logoutEffects = {
  logout: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.logout),
        switchMap(() =>
          authService.logout().pipe(
            mapResponse({
              next: () => AuthActions.logoutSuccess(),
              error: (error: ApiError) => AuthActions.logoutFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),

  redirectAfterLogout: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          router.navigate(['/auth/login']);
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
