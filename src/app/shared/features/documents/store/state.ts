import type { ApiError } from '@shared/types';
import { AsyncStatus } from '@shared/types';

import type { DocumentFile } from '../types';

export interface DocumentsState {
  status: AsyncStatus;
  data: DocumentFile[];
  error: ApiError | null;
}

export const initialState: DocumentsState = {
  status: AsyncStatus.IDLE,
  data: [],
  error: null,
};
