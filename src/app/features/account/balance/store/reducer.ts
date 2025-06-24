import { createReducer, on } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import { BalanceActions } from './actions';
import { initialState, type BalanceFeatureState } from './state';

export const balanceReducer = createReducer(
  initialState,
  on(
    BalanceActions.loadSummary,
    (state): BalanceFeatureState => ({
      ...state,
      summary: {
        ...state.summary,
        status: AsyncStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    BalanceActions.loadSummarySuccess,
    (state, { data }): BalanceFeatureState => ({
      ...state,
      summary: {
        ...state.summary,
        status: AsyncStatus.LOADED,
        data,
      },
    }),
  ),
  on(
    BalanceActions.loadSummaryFailure,
    (state, { error }): BalanceFeatureState => ({
      ...state,
      summary: {
        ...state.summary,
        status: AsyncStatus.ERROR,
        error,
      },
    }),
  ),
);
