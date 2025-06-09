import { createSelector } from '@ngrx/store';

import type {
  FilterViewModel,
  OrderListViewModel,
  OrdersViewModel,
  OrderViewModel,
  PaginationViewModel,
} from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createViewModelSelector = (
  baseSelectors: BaseSelectors,
  derivedSelectors: DerivedSelectors,
) => {
  const selectOrderListViewModel = createSelector(
    baseSelectors.selectIsOrderListLoading,
    baseSelectors.selectIsOrderListLoaded,
    baseSelectors.selectOrderList,
    baseSelectors.selectTotalCount,
    derivedSelectors.selectTotalPages,
    baseSelectors.selectSelectedOrderId,
    baseSelectors.selectOrderListError,
    (
      isLoading,
      isLoaded,
      orders,
      totalCount,
      totalPages,
      selectedOrderId,
      error,
    ): OrderListViewModel => ({
      isLoading,
      isLoaded,
      orders,
      totalCount,
      totalPages,
      selectedOrderId,
      error,
    }),
  );

  const selectOrderViewModel = createSelector(
    baseSelectors.selectIsOrderLoading,
    baseSelectors.selectIsOrderLoaded,
    baseSelectors.selectOrderError,
    baseSelectors.selectOrderDetails,
    derivedSelectors.selectIsNewOrder,
    baseSelectors.selectIsOrderCanceling,
    baseSelectors.selectOrderCancelError,
    (isLoading, isLoaded, error, details, isNew, isCanceling, cancelError): OrderViewModel => ({
      isLoading,
      isLoaded,
      error,
      details,
      isNew,
      isCanceling,
      cancelError,
    }),
  );

  const selectPaginationViewModel = createSelector(
    baseSelectors.selectCurrentPage,
    baseSelectors.selectPageSize,
    derivedSelectors.selectTotalPages,
    derivedSelectors.selectIsPaginationVisible,
    derivedSelectors.selectStartItem,
    derivedSelectors.selectEndItem,
    (currentPage, pageSize, totalPages, isVisible, startItem, endItem): PaginationViewModel => ({
      currentPage,
      pageSize,
      totalPages,
      isVisible,
      startItem,
      endItem,
    }),
  );

  const selectFilterViewModel = createSelector(
    baseSelectors.selectFilter,
    derivedSelectors.selectIsFilterActive,
    (currentFilter, isActive): FilterViewModel => ({
      currentFilter,
      isActive,
    }),
  );

  return {
    selectViewModel: createSelector(
      selectOrderListViewModel,
      selectOrderViewModel,
      selectPaginationViewModel,
      selectFilterViewModel,
      (list, order, pagination, filter): OrdersViewModel => ({
        list,
        order,
        pagination,
        filter,
      }),
    ),
  };
};
