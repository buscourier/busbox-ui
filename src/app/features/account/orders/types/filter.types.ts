import type { DeliveryCity, PickupCity } from '@shared/types';

export interface Filter {
  range: string;
  pickupCity: PickupCity | null;
  deliveryCity: DeliveryCity | null;
}
