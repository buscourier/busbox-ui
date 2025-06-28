import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError, AsyncStatus, PickupCity } from '@shared/types';

import type { ShippingZone, ShippingZoneTariff } from '../../types';

export interface BaseSelectors {
  selectZonesStatus: MemoizedSelector<object, AsyncStatus>;
  selectZones: MemoizedSelector<object, ShippingZone[] | null>;
  selectZonesError: MemoizedSelector<object, ApiError | null>;

  selectZoneTariffsStatus: MemoizedSelector<object, AsyncStatus>;
  selectZoneTariffs: MemoizedSelector<object, ShippingZoneTariff[]>;
  selectZoneTariffsError: MemoizedSelector<object, ApiError | null>;

  selectSelectedCity: MemoizedSelector<object, PickupCity | null>;
}
