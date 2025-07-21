import type { DeliveryCity, PickupCity } from '@shared/types';

export interface Filter {
  range: string | null;
  pickupCity: PickupCity | null;
  deliveryCity: DeliveryCity | null;
}
