import type { EntityAdapter } from '@ngrx/entity';
import { createSelector, type MemoizedSelector } from '@ngrx/store';

import type { Order } from '../../types';

import type { OrdersFeatureState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type OrdersFeatureStateSelector = MemoizedSelector<object, OrdersFeatureState>;

export const createBaseSelectors = (
  selectOrdersFeatureState: OrdersFeatureStateSelector,
  adapter: EntityAdapter<Order>,
): BaseSelectors => {
  const selectListState = createSelector(selectOrdersFeatureState, (state) => state.list);

  const entitySelectors = adapter.getSelectors(selectListState);

  const selectAll = entitySelectors.selectAll;
  const selectEntities = entitySelectors.selectEntities;
  const selectIds = entitySelectors.selectIds;
  // const selectTotal = entitySelectors.selectTotal;

  const selectDetailsState = createSelector(selectOrdersFeatureState, (state) => state.details);
  const selectOperationsState = createSelector(
    selectOrdersFeatureState,
    (state) => state.operations,
  );

  const selectCancelOperationState = createSelector(selectOperationsState, (state) => state.cancel);
  const selectExportOperationState = createSelector(selectOperationsState, (state) => state.export);
  const selectQueryState = createSelector(selectOrdersFeatureState, (state) => state.query);

  return {
    // ===== ENTITY SELECTORS =====
    selectAll,
    selectEntities,
    selectIds,
    // selectTotal,

    // ===== LIST SELECTORS =====
    selectListStatus: createSelector(selectListState, (state) => state.status),
    selectListError: createSelector(selectListState, (state) => state.error),
    selectTotalCount: createSelector(selectListState, (state) => state.totalCount),
    selectSelectedId: createSelector(selectListState, (state) => state.selectedId),

    // ===== DETAILS SELECTORS =====
    selectDetailsStatus: createSelector(selectDetailsState, (state) => state.status),
    selectDetailsError: createSelector(selectDetailsState, (state) => state.error),
    selectOrderDetails: createSelector(selectDetailsState, (state) => state.data),

    // ===== CANCEL SELECTORS =====

    selectCancelStatus: createSelector(selectCancelOperationState, (state) => state.status),
    selectCancelError: createSelector(selectCancelOperationState, (state) => state.error),
    selectCancelData: createSelector(selectCancelOperationState, (state) => state.data),

    // ===== EXPORT SELECTORS =====

    selectExportStatus: createSelector(selectExportOperationState, (state) => state.status),
    selectExportError: createSelector(selectExportOperationState, (state) => state.error),
    selectExportData: createSelector(selectExportOperationState, (state) => state.data),

    // ===== QUERY SELECTORS =====
    selectFilter: createSelector(selectQueryState, (state) => state.filter),
    selectPagination: createSelector(selectQueryState, (state) => state.pagination),
    selectSort: createSelector(selectQueryState, (state) => state.sort),
  };
};
