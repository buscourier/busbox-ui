import type { MemoizedSelector } from '@ngrx/store';

import type { FormValidationState, Office } from '@shared/types';

import type { Courier, ErrorStatus, ReviewSection } from '@delivery/types';

import type { PickupPointTab } from '../../types';

export interface DerivedSelectors {
  selectAvailableOffices: MemoizedSelector<object, Office[]>;
  selectIsOfficeLimited: MemoizedSelector<object, boolean>;
  selectTabs: MemoizedSelector<object, PickupPointTab[]>;
  selectActiveTab: MemoizedSelector<object, PickupPointTab | null>;
  selectIsCourierSelected: MemoizedSelector<object, boolean>;
  selectCourier: MemoizedSelector<object, Courier | null>;
  selectFormState: MemoizedSelector<object, FormValidationState>;
  selectIsPickupLimited: MemoizedSelector<object, boolean>;
  selectErrorStatus: MemoizedSelector<object, ErrorStatus>;
  selectReviewSection: MemoizedSelector<object, ReviewSection>;
  selectActiveTabName: MemoizedSelector<object, string>;
  selectIsPickupPointValid: MemoizedSelector<object, boolean>;
  selectIsPickupPointComplete: MemoizedSelector<object, boolean>;
}
