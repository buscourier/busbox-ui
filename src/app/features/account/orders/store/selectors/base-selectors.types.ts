import type { Dictionary } from '@ngrx/entity';
import { type MemoizedSelector } from '@ngrx/store';

import type { ApiError, AsyncStatus, Pagination } from '@shared/types';

import type { Filter, Order, OrderDetails } from '../../types';

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

  selectCancelStatus: MemoizedSelector<object, AsyncStatus>;
  selectCancelError: MemoizedSelector<object, ApiError | null>;
  selectCancelData: MemoizedSelector<object, Record<string, boolean>>;

  // ===== EXPORT SELECTORS =====

  selectExportStatus: MemoizedSelector<object, AsyncStatus>;
  selectExportError: MemoizedSelector<object, ApiError | null>;
  selectExportData: MemoizedSelector<object, boolean>;

  // ===== QUERY SELECTORS =====
  selectFilter: MemoizedSelector<object, Filter>;
  selectPagination: MemoizedSelector<object, Pagination>;
}
