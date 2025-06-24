import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { TuiAlertService } from '@taiga-ui/core';
import { filter, switchMap } from 'rxjs';

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
        switchMap(() => authFacade.getCurrentUser()),
        filter((user) => !!user),
        switchMap((user) =>
          balanceService.getBalanceSummary(user.id).pipe(
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
  loadSummaryFailure: createEffect(
    (
      actions$ = inject(Actions),
      alert = inject(TuiAlertService),
      transloco = inject(TranslocoService),
    ) => {
      return actions$.pipe(
        ofType(BalanceActions.loadSummaryFailure),
        switchMap(() => {
          return alert.open('Не удалось загрузить данные', {
            label: transloco.translate('alert.labels.error'),
            autoClose: 0,
            appearance: 'error',
          });
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
