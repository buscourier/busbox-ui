import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError, AsyncStatus } from '@shared/types';

import type { Confidant, ProfileField } from '../../types';

export interface BaseSelectors {
  selectFieldsStatus: MemoizedSelector<object, AsyncStatus>;
  selectFields: MemoizedSelector<object, ProfileField[]>;
  selectFieldsError: MemoizedSelector<object, ApiError | null>;

  selectUpdateFieldsStatus: MemoizedSelector<object, AsyncStatus>;
  selectUpdateFieldsData: MemoizedSelector<object, ProfileField[]>;
  selectUpdateFieldsError: MemoizedSelector<object, ApiError | null>;

  selectConfidantsStatus: MemoizedSelector<object, AsyncStatus>;
  selectConfidants: MemoizedSelector<object, Confidant[]>;
  selectConfidantsError: MemoizedSelector<object, ApiError | null>;
}
