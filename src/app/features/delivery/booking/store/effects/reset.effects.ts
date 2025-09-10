import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { AuthActions } from '@auth/store';

import { DeliveryActions } from '@delivery/store';

import { BookingActions } from '../actions';

export const resetEffects = {
  resetOnGlobalReset: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(DeliveryActions.resetDelivery),
        map(() => BookingActions.resetState()),
      );
    },
    { functional: true },
  ),
  resetOnLogout: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(AuthActions.logout),
        map(() => BookingActions.resetState()),
      );
    },
    { functional: true },
  ),
};
