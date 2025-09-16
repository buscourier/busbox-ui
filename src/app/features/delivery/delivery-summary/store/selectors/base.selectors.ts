import type { MemoizedSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';

import type { DeliverySummaryState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type DeliverySummaryStateSelector = MemoizedSelector<object, DeliverySummaryState>;

export const createBaseSelectors = (
  selectDeliverySummaryState: DeliverySummaryStateSelector,
): BaseSelectors => ({
  selectStatus: createSelector(selectDeliverySummaryState, (state) => state.status),
  selectError: createSelector(selectDeliverySummaryState, (state) => state.error),
  selectTotalAmount: createSelector(selectDeliverySummaryState, (state) => state.totalAmount),
});
