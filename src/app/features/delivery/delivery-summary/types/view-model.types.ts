import type { ApiError } from '@shared/types';

import type { ActiveOrderDetails } from '@delivery/delivery-details/types';

import type { DeliveryDirection } from './delivery-direction.types';
import type { DeliveryMethods } from './delivery-methods.types';

export interface DeliverySummaryBaseViewModel {
  isIdle: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  error: ApiError | null;
  totalAmount: number;
}

export interface DeliverySummaryViewModel extends DeliverySummaryBaseViewModel {
  direction: DeliveryDirection | null;
  methods: DeliveryMethods;
  orderDetails: ActiveOrderDetails;
}
