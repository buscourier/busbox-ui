import { createSelector } from '@ngrx/store';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const selectTotalPages = createSelector(
    baseSelectors.selectTotalCount,
    baseSelectors.selectPageSize,
    (totalCount, pageSize): number => {
      if (!totalCount || totalCount === '0') return 0;

      const total = parseInt(totalCount, 10);
      if (isNaN(total) || total <= 0) return 0;

      return Math.ceil(total / pageSize);
    },
  );

  const selectIsPaginationVisible = createSelector(
    selectTotalPages,
    (totalPages): boolean => totalPages > 1,
  );

  const selectStartItem = createSelector(
    baseSelectors.selectCurrentPage,
    baseSelectors.selectPageSize,
    baseSelectors.selectTotalCount,
    (currentPage, pageSize, totalCount) => {
      if (!totalCount) return 0;

      return Number(totalCount) > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    },
  );

  const selectEndItem = createSelector(
    baseSelectors.selectCurrentPage,
    baseSelectors.selectPageSize,
    baseSelectors.selectTotalCount,
    (currentPage, pageSize, totalCount) => {
      if (!totalCount) return 0;

      return Math.min(currentPage * pageSize, Number(totalCount));
    },
  );

  const selectIsNewOrder = createSelector(baseSelectors.selectOrderDetails, (details) => {
    if (!details) return false;

    return details.order.order_status_charcode === 'ORDER_POSTING';
  });

  const selectIsFilterActive = createSelector(baseSelectors.selectFilter, (filter) => {
    const { pickupCity, deliveryCity, range } = filter;

    return !!pickupCity || !!deliveryCity || !!range;
  });

  const selectCanExportOrders = createSelector(
    baseSelectors.selectOrderList,
    baseSelectors.selectIsOrdersExporting,
    baseSelectors.selectIsOrderListLoading,
    (orders, isExporting, isListLoading) => orders.length > 0 && !isExporting && !isListLoading,
  );

  return {
    selectTotalPages,
    selectIsPaginationVisible,
    selectIsNewOrder,
    selectIsFilterActive,
    selectStartItem,
    selectEndItem,
    selectCanExportOrders,
  };
};
