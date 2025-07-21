import { createSelector } from '@ngrx/store';

import type { BalanceViewModel, SummaryViewModel } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createViewModelSelector = (
  baseSelectors: BaseSelectors,
  derivedSelectors: DerivedSelectors,
) => {
  const selectSummaryViewModel = createSelector(
    derivedSelectors.selectIsSummaryLoading,
    derivedSelectors.selectHasSummary,
    baseSelectors.selectSummary,
    (isLoading, hasData, data): SummaryViewModel => ({ isLoading, hasData, data }),
  );

  return {
    selectViewModel: createSelector(
      selectSummaryViewModel,
      (summary): BalanceViewModel => ({ summary }),
    ),
  };
};
