import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError, AsyncStatus } from '@shared/types';

import type { NewsDetails, NewsItem } from '../../types';

export interface BaseSelectors {
  selectNewsListStatus: MemoizedSelector<object, AsyncStatus>;
  selectNewsList: MemoizedSelector<object, NewsItem[]>;
  selectNewsListError: MemoizedSelector<object, ApiError | null>;

  selectNewsDetailsStatus: MemoizedSelector<object, AsyncStatus>;
  selectNewsDetails: MemoizedSelector<object, NewsDetails | null>;
  selectNewsDetailsError: MemoizedSelector<object, ApiError | null>;
}
