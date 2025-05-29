import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type { Confidant, ProfileField } from '../../types';

export interface BaseSelectors {
  selectIsFieldsLoading: MemoizedSelector<object, boolean>;
  selectIsFieldsLoaded: MemoizedSelector<object, boolean>;
  selectIsFieldsUpdating: MemoizedSelector<object, boolean>;
  selectFieldsError: MemoizedSelector<object, ApiError | null>;
  selectFieldsUpdateError: MemoizedSelector<object, ApiError | null>;
  selectFields: MemoizedSelector<object, ProfileField[]>;

  selectIsConfidantsLoading: MemoizedSelector<object, boolean>;
  selectIsConfidantsLoaded: MemoizedSelector<object, boolean>;
  selectConfidantsError: MemoizedSelector<object, ApiError | null>;
  selectConfidants: MemoizedSelector<object, Confidant[]>;
}
