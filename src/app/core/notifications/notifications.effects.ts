import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, tap } from 'rxjs';

import { NotificationsActions } from './notifications.actions';
import { NotificationsAdapter } from './notifications.adapter';

export const NotificationsEffects = {
  onError: createEffect(
    (
      actions$ = inject(Actions),
      notifications = inject(NotificationsAdapter),
      platformId = inject(PLATFORM_ID),
    ) => {
      if (!isPlatformBrowser(platformId)) return EMPTY;
      return actions$.pipe(
        ofType(NotificationsActions.showError),
        tap(({ message }) => notifications.error(message)),
      );
    },
    { functional: true, dispatch: false },
  ),
  onSuccess: createEffect(
    (
      actions$ = inject(Actions),
      notifications = inject(NotificationsAdapter),
      platformId = inject(PLATFORM_ID),
    ) => {
      if (!isPlatformBrowser(platformId)) return EMPTY;
      return actions$.pipe(
        ofType(NotificationsActions.showSuccess),
        tap(({ message }) => notifications.success(message)),
      );
    },
    { functional: true, dispatch: false },
  ),
};
