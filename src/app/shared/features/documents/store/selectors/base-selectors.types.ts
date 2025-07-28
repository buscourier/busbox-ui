import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError, AsyncStatus } from '@shared/types';

import type { DocumentFile } from '../../types';

export interface BaseSelectors {
  selectDocumentsStatus: MemoizedSelector<object, AsyncStatus>;
  selectDocuments: MemoizedSelector<object, DocumentFile[]>;
  selectDocumentsError: MemoizedSelector<object, ApiError | null>;
}
