import type { Dictionary } from '@ngrx/entity';
import { type MemoizedSelector } from '@ngrx/store';

import type { ApiError, AsyncStatus, Pagination } from '@shared/types';

import type { Filter, Order, OrderDetails, SortConfig } from '../../types';

export interface BaseSelectors {
  // Entity selectors
  selectAll: MemoizedSelector<object, Order[]>;
  selectEntities: MemoizedSelector<object, Dictionary<Order>>;
  selectIds: MemoizedSelector<object, string[] | number[]>;
  // selectTotal: MemoizedSelector<object, number>;

  // ===== LIST SELECTORS =====
  selectListStatus: MemoizedSelector<object, AsyncStatus>;
  selectListError: MemoizedSelector<object, ApiError | null>;
  selectTotalCount: MemoizedSelector<object, number>;
  selectSelectedId: MemoizedSelector<object, string | null>;

  // ===== DETAILS SELECTORS =====
  selectDetailsStatus: MemoizedSelector<object, AsyncStatus>;
  selectDetailsError: MemoizedSelector<object, ApiError | null>;
  selectOrderDetails: MemoizedSelector<object, OrderDetails | null>;

  // ===== CANCEL SELECTORS =====

  selectCancelOrderStatus: MemoizedSelector<object, AsyncStatus>;
  selectCancelOrderError: MemoizedSelector<object, ApiError | null>;
  selectCancelOrderData: MemoizedSelector<object, Record<string, boolean> | null>;

  // ===== EXPORT SELECTORS =====

  selectExportListStatus: MemoizedSelector<object, AsyncStatus>;
  selectExportListError: MemoizedSelector<object, ApiError | null>;
  selectExportListData: MemoizedSelector<object, boolean | null>;

  // ===== QUERY SELECTORS =====
  selectFilter: MemoizedSelector<object, Filter>;
  selectPagination: MemoizedSelector<object, Pagination>;
  selectSort: MemoizedSelector<object, SortConfig>;
}
