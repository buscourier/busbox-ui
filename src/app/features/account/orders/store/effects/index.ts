import { orderListEffects } from './order-list.effects';
import { orderEffects } from './order.effects';

export const OrdersEffects = {
  ...orderListEffects,
  ...orderEffects,
};
