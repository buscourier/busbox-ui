import type { EntityAdapter } from '@ngrx/entity';
import type { MemoizedSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';

import { LoadingStatus } from '@shared/types';

import type { OptionsState, Order } from '../../types';

import type { DeliveryDetailsState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type DeliveryDetailsStateSelector = MemoizedSelector<object, DeliveryDetailsState>;

export const createBaseSelectors = (
  selectDeliveryDetailsState: DeliveryDetailsStateSelector,
  adapter: EntityAdapter<Order>,
): BaseSelectors => {
  const entitySelectors = adapter.getSelectors(selectDeliveryDetailsState);

  // Basic entity selectors
  const selectAll = entitySelectors.selectAll;
  const selectEntities = entitySelectors.selectEntities;
  const selectIds = entitySelectors.selectIds;
  const selectTotal = entitySelectors.selectTotal;

  const selectOptionsState = createSelector(
    selectDeliveryDetailsState,
    (state: DeliveryDetailsState) => state.options,
  );

  // State selectors
  const selectIsOptionsLoading = createSelector(
    selectOptionsState,
    (options: OptionsState) => options.status === LoadingStatus.LOADING,
  );

  const selectIsOptionsLoaded = createSelector(
    selectOptionsState,
    (options: OptionsState) => options.status === LoadingStatus.LOADED,
  );

  const selectOptionsError = createSelector(
    selectOptionsState,
    (options: OptionsState) => options.error,
  );

  const selectOptions = createSelector(selectOptionsState, (options: OptionsState) => options.data);

  const selectActiveOrderId = createSelector(
    selectDeliveryDetailsState,
    (state: DeliveryDetailsState) => state.activeOrderId,
  );

  return {
    // Entity selectors
    selectAll,
    selectEntities,
    selectIds,
    selectTotal,

    // State selectors
    selectIsOptionsLoading,
    selectIsOptionsLoaded,
    selectOptionsError,
    selectOptions,
    selectActiveOrderId,
  };
};
