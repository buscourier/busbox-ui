import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap, tap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { AuthService } from '../../services/auth.service';

import { AuthActions } from '../actions';

export const registerEffects = {
  register: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.register),
        switchMap(({ userData }) =>
          authService.register(userData).pipe(
            mapResponse({
              next: (response) => AuthActions.registerSuccess({ response }),
              error: (error: ApiError) => AuthActions.registerFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),

  redirectAfterRegister: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          router.navigate(['/']);
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
