import { createSelector, type MemoizedSelector } from '@ngrx/store';

import type { BalanceFeatureState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type BalanceFeatureStateSelector = MemoizedSelector<object, BalanceFeatureState>;

export const createBaseSelectors = (
  selectBalanceFeatureState: BalanceFeatureStateSelector,
): BaseSelectors => {
  const selectSummaryState = createSelector(selectBalanceFeatureState, (state) => state.summary);

  return {
    selectSummaryStatus: createSelector(selectSummaryState, (summary) => summary.status),
    selectSummary: createSelector(selectSummaryState, (summary) => summary.data),
    selectSummaryError: createSelector(selectSummaryState, (summary) => summary.error),
  };
};
