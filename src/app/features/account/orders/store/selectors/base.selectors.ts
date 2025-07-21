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
  const selectListState = createSelector(selectOrdersFeatureState, (orders) => orders.list);

  const entitySelectors = adapter.getSelectors(selectListState);

  const selectAll = entitySelectors.selectAll;
  const selectEntities = entitySelectors.selectEntities;
  const selectIds = entitySelectors.selectIds;
  // const selectTotal = entitySelectors.selectTotal;

  const selectDetailsState = createSelector(selectOrdersFeatureState, (orders) => orders.details);
  const selectOperationsState = createSelector(
    selectOrdersFeatureState,
    (state) => state.operations,
  );

  const selectCancelOrderState = createSelector(
    selectOperationsState,
    (operations) => operations.cancelOrder,
  );
  const selectExportListState = createSelector(
    selectOperationsState,
    (operations) => operations.exportList,
  );
  const selectQueryState = createSelector(selectOrdersFeatureState, (orders) => orders.query);

  return {
    // ===== ENTITY SELECTORS =====
    selectAll,
    selectEntities,
    selectIds,
    // selectTotal,

    // ===== LIST SELECTORS =====
    selectListStatus: createSelector(selectListState, (list) => list.status),
    selectListError: createSelector(selectListState, (list) => list.error),
    selectTotalCount: createSelector(selectListState, (list) => list.totalCount),
    selectSelectedId: createSelector(selectListState, (list) => list.selectedId),

    // ===== DETAILS SELECTORS =====
    selectDetailsStatus: createSelector(selectDetailsState, (details) => details.status),
    selectDetailsError: createSelector(selectDetailsState, (details) => details.error),
    selectOrderDetails: createSelector(selectDetailsState, (details) => details.data),

    // ===== CANCEL SELECTORS =====

    selectCancelOrderStatus: createSelector(selectCancelOrderState, (cancel) => cancel.status),
    selectCancelOrderError: createSelector(selectCancelOrderState, (cancel) => cancel.error),
    selectCancelOrderData: createSelector(selectCancelOrderState, (cancel) => cancel.data),

    // ===== EXPORT SELECTORS =====

    selectExportListStatus: createSelector(
      selectExportListState,
      (exportList) => exportList.status,
    ),
    selectExportListError: createSelector(selectExportListState, (exportList) => exportList.error),
    selectExportListData: createSelector(selectExportListState, (exportList) => exportList.data),

    // ===== QUERY SELECTORS =====
    selectFilter: createSelector(selectQueryState, (query) => query.filter),
    selectPagination: createSelector(selectQueryState, (query) => query.pagination),
    selectSort: createSelector(selectQueryState, (query) => query.sort),
  };
};
