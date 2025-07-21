import type { MemoizedSelector } from '@ngrx/store';

export interface DerivedSelectors {
  selectIsNewsListLoading: MemoizedSelector<object, boolean>;
  selectIsNewsListLoaded: MemoizedSelector<object, boolean>;
  selectIsNewsListError: MemoizedSelector<object, boolean>;
  selectHasNewsList: MemoizedSelector<object, boolean>;

  selectIsNewsDetailsLoading: MemoizedSelector<object, boolean>;
  selectIsNewsDetailsLoaded: MemoizedSelector<object, boolean>;
  selectIsNewsDetailsError: MemoizedSelector<object, boolean>;
  selectHasNewsDetails: MemoizedSelector<object, boolean>;
}
