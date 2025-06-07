import type { MemoizedSelector } from '@ngrx/store';

export interface DerivedSelectors {
  selectTotalPages: MemoizedSelector<object, number>;
  selectIsPaginationVisible: MemoizedSelector<object, boolean>;
  selectIsNewOrder: MemoizedSelector<object, boolean>;
  selectIsFilterActive: MemoizedSelector<object, boolean>;
}
