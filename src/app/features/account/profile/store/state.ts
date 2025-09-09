import { type AsyncState, AsyncStatus, type Confidant } from '@shared/types';

import type { ProfileField } from '../types';

export interface OperationsState {
  updateFields: AsyncState<ProfileField[]>;
}

export interface ProfileFeatureState {
  fields: AsyncState<ProfileField[]>;
  confidants: AsyncState<Confidant[]>;
  operations: OperationsState;
}

export const initialState: ProfileFeatureState = {
  fields: {
    status: AsyncStatus.IDLE,
    data: [],
    error: null,
  },
  confidants: {
    status: AsyncStatus.IDLE,
    data: [],
    error: null,
  },
  operations: {
    updateFields: {
      status: AsyncStatus.IDLE,
      data: [],
      error: null,
    },
  },
};
