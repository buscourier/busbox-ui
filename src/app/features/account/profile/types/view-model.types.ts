import type { ApiError } from '@shared/types';

import type { Confidant } from './confidant.types';
import type { ErrorStatus } from './error-status.types';
import type { ProfileField } from './profile-field.types';

export interface FieldsViewModel {
  isLoading: boolean;
  isLoaded: boolean;
  isUpdating: boolean;
  personalFields: ProfileField[];
  organizationFields: ProfileField[];
  discountField: ProfileField | null;
  error: ApiError | null;
}

export interface ConfidantsViewModel {
  isLoading: boolean;
  isLoaded: boolean;
  confidants: Confidant[];
  error: ApiError | null;
}

export interface ProfileViewModel {
  fields: FieldsViewModel;
  confidants: ConfidantsViewModel;
  errorStatus: ErrorStatus;
}
