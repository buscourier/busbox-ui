import type { ApiError, DocumentFile } from '@shared/types';
import { AsyncStatus } from '@shared/types';

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
