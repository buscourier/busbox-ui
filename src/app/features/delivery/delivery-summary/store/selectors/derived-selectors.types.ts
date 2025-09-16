import type { MemoizedSelector } from '@ngrx/store';

export interface DerivedSelectors {
  selectIsIdle: MemoizedSelector<object, boolean>;
  selectIsLoading: MemoizedSelector<object, boolean>;
  selectIsLoaded: MemoizedSelector<object, boolean>;
  selectIsError: MemoizedSelector<object, boolean>;
}
