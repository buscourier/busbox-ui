import { createSelector } from '@ngrx/store';

import type { DeliverySummaryBaseViewModel } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createViewModelSelector = (
  baseSelectors: BaseSelectors,
  derivedSelectors: DerivedSelectors,
) => ({
  selectBaseViewModel: createSelector(
    derivedSelectors.selectIsIdle,
    derivedSelectors.selectIsLoading,
    derivedSelectors.selectIsLoaded,
    derivedSelectors.selectIsError,
    baseSelectors.selectError,
    baseSelectors.selectTotalAmount,
    (isIdle, isLoading, isLoaded, isError, error, totalAmount): DeliverySummaryBaseViewModel => ({
      isIdle,
      isLoading,
      isLoaded,
      isError,
      error,
      totalAmount,
    }),
  ),
});
