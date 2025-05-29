import { type ApiError, LoadingStatus } from '@shared/types';

import type { Confidant, ProfileField } from '../types';

export interface ProfileFieldsState {
  status: LoadingStatus;
  items: ProfileField[];
  isUpdating: boolean;
  error: ApiError | null;
  updateError: ApiError | null;
}

export interface ConfidantsState {
  status: LoadingStatus;
  items: Confidant[];
  error: ApiError | null;
}

export interface ProfileFeatureState {
  fields: ProfileFieldsState;
  confidants: ConfidantsState;
}

export const initialState: ProfileFeatureState = {
  fields: {
    status: LoadingStatus.IDLE,
    items: [],
    isUpdating: false,
    error: null,
    updateError: null,
  },
  confidants: {
    status: LoadingStatus.IDLE,
    items: [],
    error: null,
  },
};
