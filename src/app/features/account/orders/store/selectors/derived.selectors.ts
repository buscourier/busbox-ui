import { createSelector } from '@ngrx/store';
import type { TuiComparator } from '@taiga-ui/addon-table';
import { tuiDefaultSort } from '@taiga-ui/cdk';

import { AsyncStatus } from '@shared/types';

import type { CustomSortDirection, Order } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const sortBy = (key: keyof Order, direction: CustomSortDirection): TuiComparator<Order> => {
    return (a, b) => {
      if (direction === 0) return 0;

      const aValue = a[key];
      const bValue = b[key];

      if (key === 'date') {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return direction * tuiDefaultSort(aDate, bDate);
      }

      if (key === 'order_price') {
        const aPrice = parseFloat((aValue as string).replace(/[^\d.-]/g, ''));
        const bPrice = parseFloat((bValue as string).replace(/[^\d.-]/g, ''));
        return direction * tuiDefaultSort(aPrice, bPrice);
      }

      if (key === 'order_id') {
        const aId = parseInt(aValue as string, 10);
        const bId = parseInt(bValue as string, 10);
        return direction * tuiDefaultSort(aId, bId);
      }

      return direction * tuiDefaultSort(aValue, bValue);
    };
  };

  const selectSortedOrders = createSelector(
    baseSelectors.selectAll,
    baseSelectors.selectSort,
    (orders, sort) => {
      if (!sort.field || sort.direction === 0) {
        return [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }

      return [...orders].sort(sortBy(sort.field, sort.direction));
    },
  );

  const selectIsListLoading = createSelector(
    baseSelectors.selectListStatus,
    (status) => status === AsyncStatus.LOADING || status === AsyncStatus.IDLE,
  );

  const selectIsListLoaded = createSelector(
    baseSelectors.selectListStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsListExporting = createSelector(
    baseSelectors.selectExportListStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectCanExportList = createSelector(
    baseSelectors.selectAll,
    selectIsListExporting,
    selectIsListLoading,
    (orders, isExporting, isListLoading) => orders.length > 0 && !isExporting && !isListLoading,
  );

  const selectIsListEmpty = createSelector(
    baseSelectors.selectTotalCount,
    selectIsListLoaded,
    (total, isLoaded) => isLoaded && total === 0,
  );

  const selectTotalPages = createSelector(
    baseSelectors.selectTotalCount,
    baseSelectors.selectPagination,
    (totalCount, pagination): number => {
      if (!totalCount || totalCount === 0) return 0;

      return Math.ceil(totalCount / pagination.pageSize);
    },
  );

  const selectIsDetailsLoading = createSelector(
    baseSelectors.selectDetailsStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsDetailsLoaded = createSelector(
    baseSelectors.selectDetailsStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsOrderCanceling = createSelector(
    baseSelectors.selectCancelOrderStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsPaginationVisible = createSelector(
    selectTotalPages,
    (totalPages): boolean => totalPages > 1,
  );

  const selectStartItem = createSelector(
    baseSelectors.selectPagination,
    baseSelectors.selectTotalCount,
    (pagination, totalCount) => {
      const { currentPage, pageSize } = pagination;

      if (!totalCount) return 0;

      return Number(totalCount) > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    },
  );

  const selectEndItem = createSelector(
    baseSelectors.selectPagination,
    baseSelectors.selectTotalCount,
    (pagination, totalCount) => {
      const { currentPage, pageSize } = pagination;

      if (!totalCount) return 0;

      return Math.min(currentPage * pageSize, Number(totalCount));
    },
  );

  const selectCanCancelOrder = createSelector(baseSelectors.selectOrderDetails, (details) => {
    if (!details) return false;

    return details.order.order_status_charcode === 'ORDER_POSTING';
  });

  const selectIsFilterActive = createSelector(baseSelectors.selectFilter, (filter) => {
    const { pickupCity, deliveryCity, range } = filter;

    return !!pickupCity || !!deliveryCity || !!range;
  });

  const selectErrors = createSelector(
    baseSelectors.selectListError,
    baseSelectors.selectDetailsError,
    baseSelectors.selectCancelOrderError,
    baseSelectors.selectExportListError,
    (listError, detailsError, cancelError, exportError) => {
      const errors = {
        list: listError,
        details: detailsError,
        cancelOrder: cancelError,
        exportList: exportError,
      };

      return {
        ...errors,
        hasAnyError: Object.values(errors).some(Boolean),
      };
    },
  );

  return {
    selectSortedOrders,
    selectIsListLoading,
    selectIsListLoaded,
    selectIsListEmpty,
    selectTotalPages,
    selectIsDetailsLoading,
    selectIsDetailsLoaded,
    selectIsOrderCanceling,
    selectIsPaginationVisible,
    selectStartItem,
    selectEndItem,
    selectIsFilterActive,
    selectCanCancelOrder,
    selectIsListExporting,
    selectCanExportList,
    selectErrors,
  };
};
