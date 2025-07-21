import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError, AsyncStatus } from '@shared/types';

import type { BalanceSummary } from '../../types';

export interface BaseSelectors {
  selectSummaryStatus: MemoizedSelector<object, AsyncStatus>;
  selectSummary: MemoizedSelector<object, BalanceSummary | null>;
  selectSummaryError: MemoizedSelector<object, ApiError | null>;
}
