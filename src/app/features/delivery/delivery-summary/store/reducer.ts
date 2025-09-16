import { createReducer, on } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import { DeliverySummaryActions } from './actions';
import type { DeliverySummaryState } from './state';

export const initialState: DeliverySummaryState = {
  status: AsyncStatus.IDLE,
  totalAmount: 0,
  error: null,
};

export const deliverySummaryReducer = createReducer(
  initialState,
  on(
    DeliverySummaryActions.calculateTotalAmount,
    (state): DeliverySummaryState => ({
      ...state,
      status: AsyncStatus.LOADING,
    }),
  ),
  on(
    DeliverySummaryActions.calculateTotalAmountSuccess,
    (state, { totalAmount }): DeliverySummaryState => ({
      ...state,
      totalAmount,
      status: AsyncStatus.LOADED,
    }),
  ),
  on(
    DeliverySummaryActions.calculateTotalAmountFailure,
    (state, { error }): DeliverySummaryState => ({
      ...state,
      status: AsyncStatus.ERROR,
      error,
    }),
  ),
  on(DeliverySummaryActions.resetState, (): DeliverySummaryState => initialState),
  on(
    DeliverySummaryActions.clearCalculation,
    (state): DeliverySummaryState => ({
      ...initialState,
      status: state.status,
    }),
  ),
);
