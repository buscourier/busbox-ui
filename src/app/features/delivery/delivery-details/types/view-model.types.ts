import type { OptionsViewModel } from './options.types';
import type { OrdersViewModel } from './order.types';

export interface DeliveryDetailsViewModel {
  orders: OrdersViewModel;
  options: OptionsViewModel;
}
