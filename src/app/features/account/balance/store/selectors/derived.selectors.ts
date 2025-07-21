import { createSelector } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const selectIsSummaryLoading = createSelector(
    baseSelectors.selectSummaryStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsSummaryLoaded = createSelector(
    baseSelectors.selectSummaryStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsSummaryError = createSelector(
    baseSelectors.selectSummaryStatus,
    (status) => status === AsyncStatus.ERROR,
  );

  const selectHasSummary = createSelector(
    baseSelectors.selectSummary,
    selectIsSummaryLoaded,
    (data, isLoaded) => isLoaded && !!data,
  );

  return {
    selectIsSummaryLoading,
    selectIsSummaryLoaded,
    selectIsSummaryError,
    selectHasSummary,
  };
};
