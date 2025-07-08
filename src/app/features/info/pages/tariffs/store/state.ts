import { type AsyncState, AsyncStatus, type PickupCity } from '@shared/types';

import type { ShippingZone, ShippingZoneTariff } from '../types';

export interface TariffsFeatureState {
  zones: AsyncState<ShippingZone[]>;
  zoneTariffs: AsyncState<ShippingZoneTariff[]>;
  selectedCity: PickupCity | null;
}

export const initialState: TariffsFeatureState = {
  zones: {
    status: AsyncStatus.IDLE,
    data: null,
    error: null,
  },
  zoneTariffs: {
    status: AsyncStatus.IDLE,
    data: null,
    error: null,
  },
  selectedCity: null,
};
