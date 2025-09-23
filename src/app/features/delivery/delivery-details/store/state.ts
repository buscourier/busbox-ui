import type { EntityAdapter, EntityState } from '@ngrx/entity';
import { createEntityAdapter } from '@ngrx/entity';

import { LoadingStatus } from '@shared/types';

import type { OptionsState, Order } from '../types';

export interface DeliveryDetailsState extends EntityState<Order> {
  activeOrderId: string | null;
  options: OptionsState;
}

export const adapter: EntityAdapter<Order> = createEntityAdapter<Order>({
  selectId: (order: Order) => order.id as string,
});

export const initialState: DeliveryDetailsState = adapter.getInitialState({
  activeOrderId: null,
  options: {
    status: LoadingStatus.IDLE,
    data: null,
    error: null,
  },
});
