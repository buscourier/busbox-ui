import {
  type CollectionState,
  type DeliveryCity,
  LoadingStatus,
  type Office,
  type PickupCity,
} from '@shared/types';

export interface LocationsState {
  pickupCities: CollectionState<PickupCity>;
  deliveryCities: CollectionState<DeliveryCity>;
  offices: CollectionState<Office>;
}

export const initialState: LocationsState = {
  pickupCities: {
    items: [],
    status: LoadingStatus.IDLE,
    error: null,
  },
  deliveryCities: {
    items: [],
    status: LoadingStatus.IDLE,
    error: null,
  },
  offices: {
    items: [],
    status: LoadingStatus.IDLE,
    error: null,
  },
};
