import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError, AsyncStatus } from '@shared/types';

export interface BaseSelectors {
  selectStatus: MemoizedSelector<object, AsyncStatus>;
  selectError: MemoizedSelector<object, ApiError | null>;
  selectTotalAmount: MemoizedSelector<object, number>;
}
