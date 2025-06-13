import { createSelector } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const selectIsListLoading = createSelector(
    baseSelectors.selectListStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsListLoaded = createSelector(
    baseSelectors.selectListStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsListExporting = createSelector(
    baseSelectors.selectExportStatus,
    (status) => status === AsyncStatus.LOADING,
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

  const selectIsCanceling = createSelector(
    baseSelectors.selectCancelStatus,
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

  const selectCanCancel = createSelector(baseSelectors.selectOrderDetails, (details) => {
    if (!details) return false;

    return details.order.order_status_charcode === 'ORDER_POSTING';
  });

  const selectIsFilterActive = createSelector(baseSelectors.selectFilter, (filter) => {
    const { pickupCity, deliveryCity, range } = filter;

    return !!pickupCity || !!deliveryCity || !!range;
  });

  const selectCanExport = createSelector(
    baseSelectors.selectAll,
    selectIsListExporting,
    selectIsListLoading,
    (orders, isExporting, isListLoading) => orders.length > 0 && !isExporting && !isListLoading,
  );

  const selectErrors = createSelector(
    baseSelectors.selectListError,
    baseSelectors.selectDetailsError,
    baseSelectors.selectCancelError,
    baseSelectors.selectExportError,
    (listError, detailsError, cancelError, exportError) => {
      const errors = {
        list: listError,
        details: detailsError,
        cancel: cancelError,
        export: exportError,
      };

      return {
        ...errors,
        hasAnyError: Object.values(errors).some(Boolean),
      };
    },
  );

  return {
    selectIsListLoading,
    selectIsListLoaded,
    selectIsListExporting,
    selectIsListEmpty,
    selectTotalPages,
    selectIsDetailsLoading,
    selectIsDetailsLoaded,
    selectIsCanceling,
    selectIsPaginationVisible,
    selectStartItem,
    selectEndItem,
    selectIsFilterActive,
    selectCanCancel,
    selectCanExport,
    selectErrors,
  };
};
