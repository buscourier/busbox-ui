import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError, AsyncStatus, DocumentFile } from '@shared/types';

export interface BaseSelectors {
  selectDocumentsStatus: MemoizedSelector<object, AsyncStatus>;
  selectDocuments: MemoizedSelector<object, DocumentFile[]>;
  selectDocumentsError: MemoizedSelector<object, ApiError | null>;
}
