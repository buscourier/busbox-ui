import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { AuthService } from '../../services/auth.service';

import { AuthActions } from '../actions';

export const tokenEffects = {
  refreshToken: createEffect(
    (actions$ = inject(Actions), authService = inject(AuthService)) => {
      return actions$.pipe(
        ofType(AuthActions.refreshToken),
        switchMap(() =>
          authService.refreshToken().pipe(
            mapResponse({
              next: (response) => AuthActions.refreshTokenSuccess({ response }),
              error: (error: ApiError) => AuthActions.refreshTokenFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
