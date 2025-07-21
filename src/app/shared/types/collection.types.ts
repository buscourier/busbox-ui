import type { ApiError } from './api-error.types';
import type { DeliveryCity } from './delivery-city.types';
import type { LoadingStatus } from './loading.types';
import type { Office } from './office.types';
import type { PickupCity } from './pickup-city.types';

export interface CollectionState<T extends PickupCity | DeliveryCity | Office> {
  items: T[];
  status: LoadingStatus;
  error: ApiError | null;
}
