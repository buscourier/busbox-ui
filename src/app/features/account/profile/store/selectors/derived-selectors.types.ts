import type { MemoizedSelector } from '@ngrx/store';

import type { ProfileField } from '../../types';

export interface DerivedSelectors {
  selectIsFieldsLoading: MemoizedSelector<object, boolean>;
  selectIsFieldsLoaded: MemoizedSelector<object, boolean>;
  selectHasFieldsError: MemoizedSelector<object, boolean>;
  selectPersonalFields: MemoizedSelector<object, ProfileField[]>;
  selectOrganizationFields: MemoizedSelector<object, ProfileField[]>;
  selectDiscountField: MemoizedSelector<object, ProfileField | null>;
  selectIsConfidantsLoading: MemoizedSelector<object, boolean>;
  selectIsConfidantsLoaded: MemoizedSelector<object, boolean>;
  selectHasConfidantsError: MemoizedSelector<object, boolean>;
  selectIsFieldsUpdating: MemoizedSelector<object, boolean>;
  selectIsFieldsUpdated: MemoizedSelector<object, boolean>;
  selectHasFieldsUpdateError: MemoizedSelector<object, boolean>;
}
