import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { AuthActions } from '../actions';

export const logoutEffects = {
  logout: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(AuthActions.logout),
        map(() => {
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
