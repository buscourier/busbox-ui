import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type { Filter, Order, OrderDetails } from '../../types';

export interface BaseSelectors {
  selectIsOrderListLoading: MemoizedSelector<object, boolean>;
  selectIsOrderListLoaded: MemoizedSelector<object, boolean>;
  selectOrderListError: MemoizedSelector<object, ApiError | null>;
  selectOrderList: MemoizedSelector<object, Order[]>;

  selectTotalCount: MemoizedSelector<object, string | null>;
  selectSelectedOrderId: MemoizedSelector<object, string | null>;

  selectIsOrderLoading: MemoizedSelector<object, boolean>;
  selectIsOrderLoaded: MemoizedSelector<object, boolean>;
  selectOrderError: MemoizedSelector<object, ApiError | null>;
  selectOrderDetails: MemoizedSelector<object, OrderDetails | null>;

  selectIsOrderCanceling: MemoizedSelector<object, boolean>;
  selectOrderCancelError: MemoizedSelector<object, ApiError | null>;

  selectIsOrdersExporting: MemoizedSelector<object, boolean>;
  selectIsOrdersExported: MemoizedSelector<object, boolean>;
  selectOrdersExportError: MemoizedSelector<object, ApiError | null>;

  selectCurrentPage: MemoizedSelector<object, number>;
  selectPageSize: MemoizedSelector<object, number>;

  selectFilter: MemoizedSelector<object, Filter>;
}
