import type { MemoizedSelector } from '@ngrx/store';

import type { Errors, Order } from '../../types';

export interface DerivedSelectors {
  selectSortedOrders: MemoizedSelector<object, Order[]>;
  selectIsListLoading: MemoizedSelector<object, boolean>;
  selectIsListLoaded: MemoizedSelector<object, boolean>;
  selectIsListEmpty: MemoizedSelector<object, boolean>;
  selectTotalPages: MemoizedSelector<object, number>;
  selectIsDetailsLoading: MemoizedSelector<object, boolean>;
  selectIsDetailsLoaded: MemoizedSelector<object, boolean>;
  selectIsOrderCanceling: MemoizedSelector<object, boolean>;
  selectIsPaginationVisible: MemoizedSelector<object, boolean>;
  selectStartItem: MemoizedSelector<object, number>;
  selectEndItem: MemoizedSelector<object, number>;
  selectIsFilterActive: MemoizedSelector<object, boolean>;
  selectCanExportList: MemoizedSelector<object, boolean>;
  selectIsListExporting: MemoizedSelector<object, boolean>;
  selectCanCancelOrder: MemoizedSelector<object, boolean>;
  selectErrors: MemoizedSelector<object, Errors>;
}
