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
  const selectPaginationViewModel = createSelector(
    baseSelectors.selectPagination,
    derivedSelectors.selectTotalPages,
    derivedSelectors.selectIsPaginationVisible,
    derivedSelectors.selectStartItem,
    derivedSelectors.selectEndItem,
    (pagination, totalPages, isVisible, startItem, endItem): PaginationViewModel => {
      const { currentPage, pageSize } = pagination;

      return {
        currentPage,
        pageSize,
        totalPages,
        isVisible,
        startItem,
        endItem,
      };
    },
  );

  const selectFilterViewModel = createSelector(
    baseSelectors.selectFilter,
    derivedSelectors.selectIsFilterActive,
    (params, isActive): FilterViewModel => ({
      params,
      isActive,
    }),
  );

  const selectOrderListViewModel = createSelector(
    derivedSelectors.selectIsListLoading,
    derivedSelectors.selectIsListLoaded,
    derivedSelectors.selectIsListExporting,
    derivedSelectors.selectIsListEmpty,
    baseSelectors.selectAll,
    baseSelectors.selectTotalCount,
    baseSelectors.selectSelectedId,
    derivedSelectors.selectCanExport,
    selectPaginationViewModel,
    (
      isLoading,
      isLoaded,
      isExporting,
      isEmpty,
      orders,
      totalCount,
      selectedId,
      canExport,
      pagination,
    ): OrderListViewModel => ({
      isLoading,
      isLoaded,
      isExporting,
      isEmpty,
      orders,
      totalCount,
      selectedId,
      canExport,
      pagination,
    }),
  );

  const selectOrderViewModel = createSelector(
    derivedSelectors.selectIsDetailsLoading,
    derivedSelectors.selectIsDetailsLoaded,
    baseSelectors.selectOrderDetails,
    derivedSelectors.selectCanCancel,
    derivedSelectors.selectIsCanceling,
    (isLoading, isLoaded, details, canCancel, isCanceling): OrderViewModel => ({
      isLoading,
      isLoaded,
      details,
      canCancel,
      isCanceling,
    }),
  );

  return {
    selectViewModel: createSelector(
      selectOrderListViewModel,
      selectOrderViewModel,
      selectFilterViewModel,
      derivedSelectors.selectErrors,
      (list, order, filter, errors): OrdersViewModel => ({
        list,
        order,
        filter,
        errors,
      }),
    ),
  };
};
