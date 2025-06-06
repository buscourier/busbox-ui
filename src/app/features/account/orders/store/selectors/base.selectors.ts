import { createSelector, type MemoizedSelector } from '@ngrx/store';

import { LoadingStatus } from '@shared/types';

import type { OrdersFeatureState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type OrdersFeatureStateSelector = MemoizedSelector<object, OrdersFeatureState>;

export const createBaseSelectors = (
  selectOrdersFeatureState: OrdersFeatureStateSelector,
): BaseSelectors => {
  const selectListState = createSelector(selectOrdersFeatureState, (state) => state.list);
  const selectOrderState = createSelector(selectOrdersFeatureState, (state) => state.order);
  const selectPaginationState = createSelector(
    selectOrdersFeatureState,
    (state) => state.pagination,
  );

  return {
    selectIsOrderListLoading: createSelector(
      selectListState,
      (state) => state.status === LoadingStatus.LOADING,
    ),
    selectIsOrderListLoaded: createSelector(
      selectListState,
      (state) => state.status === LoadingStatus.LOADED,
    ),
    selectOrderListError: createSelector(selectListState, (state) => state.error),
    selectOrderList: createSelector(selectListState, (state) => state.orders),

    selectTotalCount: createSelector(selectListState, (state) => state.totalCount),
    selectSelectedOrderId: createSelector(selectListState, (state) => state.selectedId),

    selectIsOrderLoading: createSelector(
      selectOrderState,
      (state) => state.status === LoadingStatus.LOADING,
    ),
    selectIsOrderLoaded: createSelector(
      selectOrderState,
      (state) => state.status === LoadingStatus.LOADED,
    ),
    selectOrderError: createSelector(selectOrderState, (state) => state.error),
    selectOrderDetails: createSelector(selectOrderState, (state) => state.details),

    selectIsOrderCanceling: createSelector(selectOrderState, (state) => state.isCanceling),
    selectOrderCancelError: createSelector(selectOrderState, (state) => state.cancelError),

    selectCurrentPage: createSelector(selectPaginationState, (state) => state.currentPage),
    selectPageSize: createSelector(selectPaginationState, (state) => state.pageSize),

    selectFilter: createSelector(selectOrdersFeatureState, (state) => state.filter),
  };
};
