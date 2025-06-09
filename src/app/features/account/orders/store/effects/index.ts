import { exportEffects } from './export.effects';
import { orderListEffects } from './order-list.effects';
import { orderEffects } from './order.effects';
import { routerEffects } from './router.effects';

export const OrdersEffects = {
  ...orderListEffects,
  ...orderEffects,
  ...routerEffects,
  ...exportEffects,
};
