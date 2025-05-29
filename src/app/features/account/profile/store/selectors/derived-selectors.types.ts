import type { MemoizedSelector } from '@ngrx/store';

import type { ErrorStatus, ProfileField } from '../../types';

export interface DerivedSelectors {
  selectPersonalFields: MemoizedSelector<object, ProfileField[]>;
  selectOrganizationFields: MemoizedSelector<object, ProfileField[]>;
  selectDiscountField: MemoizedSelector<object, ProfileField | null>;
  selectErrorStatus: MemoizedSelector<object, ErrorStatus>;
}
