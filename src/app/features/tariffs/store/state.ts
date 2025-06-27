import { type AsyncState, AsyncStatus } from '@shared/types';

import type { ShippingZone, ShippingZoneTariff } from '../types';

export interface TariffsFeatureState {
  zones: AsyncState<ShippingZone[]>;
  zoneTariffs: AsyncState<ShippingZoneTariff[]>;
  selectedCityId: string | null;
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
  selectedCityId: null,
};
