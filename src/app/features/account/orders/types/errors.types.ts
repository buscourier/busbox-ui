import type { ApiError } from '@shared/types';

export interface Errors {
  list: ApiError | null;
  details: ApiError | null;
  cancel: ApiError | null;
  export: ApiError | null;
  hasAnyError: boolean;
}
