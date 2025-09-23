import type { MemoizedSelector } from '@ngrx/store';

import type {
  ActiveOrderDetails,
  AutoPartPreset,
  Cargo,
  EnhancedOrder,
  Order,
  OrderReviewDetails,
  Service,
} from '../../types';

export interface DerivedSelectors {
  selectActiveOrder: MemoizedSelector<object, Order | null>;
  selectIsActiveOrderValid: MemoizedSelector<object, boolean>;
  selectIsAllOrdersValid: MemoizedSelector<object, boolean>;
  selectEnhancedOrders: MemoizedSelector<object, EnhancedOrder[]>;
  selectCargoTypes: MemoizedSelector<object, Cargo[]>;
  selectAutoPartsOptions: MemoizedSelector<object, AutoPartPreset[]>;
  selectOtherCargosOptions: MemoizedSelector<object, Cargo[]>;
  selectAdditionalServicesOptions: MemoizedSelector<object, Service[]>;
  selectPackagingOptions: MemoizedSelector<object, Service[]>;
  selectActiveOrderDetails: MemoizedSelector<object, ActiveOrderDetails>;
  selectOrderReviewDetails: MemoizedSelector<object, OrderReviewDetails>;
}
