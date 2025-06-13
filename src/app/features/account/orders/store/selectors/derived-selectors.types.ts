import type { MemoizedSelector } from '@ngrx/store';

import type { Errors } from '../../types';

export interface DerivedSelectors {
  selectIsListLoading: MemoizedSelector<object, boolean>;
  selectIsListLoaded: MemoizedSelector<object, boolean>;
  selectIsListExporting: MemoizedSelector<object, boolean>;
  selectIsListEmpty: MemoizedSelector<object, boolean>;
  selectTotalPages: MemoizedSelector<object, number>;
  selectIsDetailsLoading: MemoizedSelector<object, boolean>;
  selectIsDetailsLoaded: MemoizedSelector<object, boolean>;
  selectIsCanceling: MemoizedSelector<object, boolean>;
  selectIsPaginationVisible: MemoizedSelector<object, boolean>;
  selectStartItem: MemoizedSelector<object, number>;
  selectEndItem: MemoizedSelector<object, number>;
  selectIsFilterActive: MemoizedSelector<object, boolean>;
  selectCanExport: MemoizedSelector<object, boolean>;
  selectCanCancel: MemoizedSelector<object, boolean>;
  selectErrors: MemoizedSelector<object, Errors>;
}
