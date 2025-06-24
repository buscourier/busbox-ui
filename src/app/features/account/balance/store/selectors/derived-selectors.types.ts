import type { MemoizedSelector } from '@ngrx/store';

export interface DerivedSelectors {
  selectIsSummaryLoading: MemoizedSelector<object, boolean>;
  selectIsSummaryLoaded: MemoizedSelector<object, boolean>;
  selectIsSummaryError: MemoizedSelector<object, boolean>;
  selectHasSummary: MemoizedSelector<object, boolean>;
}
