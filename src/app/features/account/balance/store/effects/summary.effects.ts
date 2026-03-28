import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { filter, first, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationsActions } from '@core/notifications';

import type { ApiError } from '@shared/types';

import { AuthFacade } from '@auth';

import { BalanceService } from '../../services';

import { BalanceActions } from '../actions';

export const summaryEffects = {
  loadSummary: createEffect(
    (
      actions$ = inject(Actions),
      authFacade = inject(AuthFacade),
      balanceService = inject(BalanceService),
    ) => {
      return actions$.pipe(
        ofType(BalanceActions.loadSummary),
        switchMap(() =>
          authFacade.getCurrentUser().pipe(
            filter((user) => !!user),
            first(),
            switchMap((user) =>
              balanceService.getBalanceSummary(user.id).pipe(
                mapResponse({
                  next: (data) => BalanceActions.loadSummarySuccess({ data }),
                  error: (error: ApiError) => BalanceActions.loadSummaryFailure({ error }),
                }),
              ),
            ),
          ),
        ),
      );
    },
    { functional: true },
  ),
  onLoadFailure: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(BalanceActions.loadSummaryFailure),
        map(() =>
          NotificationsActions.showError({
            message: 'Не удалось загрузить данные',
          }),
        ),
      );
    },
    { functional: true },
  ),
};
