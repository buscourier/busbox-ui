import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { filter, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthFacade } from '@core/auth';
import { NotificationsActions } from '@core/notifications';

import type { ApiError } from '@shared/types';

import { BalanceService } from '../../services';

import { BalanceActions } from '../actions';

export const summaryEffects = {
  loadSummary: createEffect(
    (
      actions$ = inject(Actions),
      auth = inject(AuthFacade),
      balanceService = inject(BalanceService),
    ) => {
      return actions$.pipe(
        ofType(BalanceActions.loadSummary),
        concatLatestFrom(() => auth.currentUser$),
        filter(([, user]) => !!user),
        switchMap(([, user]) =>
          balanceService.getBalanceSummary(user!.id).pipe(
            mapResponse({
              next: (data) => BalanceActions.loadSummarySuccess({ data }),
              error: (error: ApiError) => BalanceActions.loadSummaryFailure({ error }),
            }),
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
