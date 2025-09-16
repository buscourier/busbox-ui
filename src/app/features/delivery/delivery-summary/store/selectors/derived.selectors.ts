import { createSelector } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const selectIsIdle = createSelector(
    baseSelectors.selectStatus,
    (status) => status === AsyncStatus.IDLE,
  );

  const selectIsLoading = createSelector(
    baseSelectors.selectStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsLoaded = createSelector(
    baseSelectors.selectStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsError = createSelector(
    baseSelectors.selectStatus,
    (status) => status === AsyncStatus.ERROR,
  );

  return {
    selectIsIdle,
    selectIsLoading,
    selectIsLoaded,
    selectIsError,
  };
};
