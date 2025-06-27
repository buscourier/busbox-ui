import type { MemoizedSelector } from '@ngrx/store';

export interface DerivedSelectors {
  selectIsZonesLoading: MemoizedSelector<object, boolean>;
  selectIsZonesLoaded: MemoizedSelector<object, boolean>;
  selectIsZonesError: MemoizedSelector<object, boolean>;
  selectHasZones: MemoizedSelector<object, boolean>;
  selectIsZoneTariffsLoading: MemoizedSelector<object, boolean>;
  selectIsZoneTariffsLoaded: MemoizedSelector<object, boolean>;
  selectIsZoneTariffsError: MemoizedSelector<object, boolean>;
  selectHasZoneTariffs: MemoizedSelector<object, boolean>;
}
