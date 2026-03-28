import type { MemoizedSelector } from '@ngrx/store';

import type { LocationsErrorStatus, PickupCity } from '@shared/types';

export interface DerivedSelectors {
  selectErrorStatus: MemoizedSelector<object, LocationsErrorStatus>;
  selectPickupCityById: (id: string) => MemoizedSelector<object, PickupCity | null>;
}
