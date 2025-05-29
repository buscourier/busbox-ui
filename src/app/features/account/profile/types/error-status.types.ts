import type { ApiError } from '@shared/types';

export interface ErrorStatus {
  fieldsError: ApiError | null;
  fieldsUpdateError: ApiError | null;
  confidantsError: ApiError | null;
  hasAnyError: boolean;
}
