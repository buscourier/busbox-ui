import { createSelector } from '@ngrx/store';

import type { NewsDetailsViewModel, NewsListViewModel, NewsViewModel } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createViewModelSelector = (
  baseSelectors: BaseSelectors,
  derivedSelectors: DerivedSelectors,
) => {
  const selectNewsListViewModel = createSelector(
    derivedSelectors.selectIsNewsListLoading,
    derivedSelectors.selectHasNewsList,
    baseSelectors.selectNewsList,
    (isLoading, hasData, data): NewsListViewModel => ({ isLoading, hasData, data }),
  );

  const selectNewsDetailsViewModel = createSelector(
    derivedSelectors.selectIsNewsDetailsLoading,
    derivedSelectors.selectHasNewsDetails,
    baseSelectors.selectNewsDetails,
    (isLoading, hasData, data): NewsDetailsViewModel => ({ isLoading, hasData, data }),
  );

  return {
    selectViewModel: createSelector(
      selectNewsListViewModel,
      selectNewsDetailsViewModel,
      (list, details): NewsViewModel => ({
        list,
        details,
      }),
    ),
  };
};
