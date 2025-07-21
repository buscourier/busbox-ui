import type { ApiError } from '@shared/types';

export interface Errors {
  list: ApiError | null;
  details: ApiError | null;
  cancelOrder: ApiError | null;
  exportList: ApiError | null;
  hasAnyError: boolean;
}
