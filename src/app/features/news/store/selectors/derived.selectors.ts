import { createSelector } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const selectIsNewsListLoading = createSelector(
    baseSelectors.selectNewsListStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsNewsListLoaded = createSelector(
    baseSelectors.selectNewsListStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsNewsListError = createSelector(
    baseSelectors.selectNewsListStatus,
    (status) => status === AsyncStatus.ERROR,
  );

  const selectHasNewsList = createSelector(
    baseSelectors.selectNewsList,
    selectIsNewsListLoaded,
    (list, isLoaded) => isLoaded && !!list.length,
  );

  const selectIsNewsDetailsLoading = createSelector(
    baseSelectors.selectNewsDetailsStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsNewsDetailsLoaded = createSelector(
    baseSelectors.selectNewsDetailsStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsNewsDetailsError = createSelector(
    baseSelectors.selectNewsDetailsStatus,
    (status) => status === AsyncStatus.ERROR,
  );

  const selectHasNewsDetails = createSelector(
    baseSelectors.selectNewsDetails,
    selectIsNewsListLoaded,
    (data, isLoaded) => isLoaded && !!data,
  );

  return {
    selectIsNewsListLoading,
    selectIsNewsListLoaded,
    selectIsNewsListError,
    selectHasNewsList,

    selectIsNewsDetailsLoading,
    selectIsNewsDetailsLoaded,
    selectIsNewsDetailsError,
    selectHasNewsDetails,
  };
};
