import {
  type ApiError,
  type DeliveryCity,
  LoadingStatus,
  type PaginationState,
  type PickupCity,
} from '@shared/types';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';
import type { Order, OrderDetails } from '../types';

export interface OrderListState {
  status: LoadingStatus;
  orders: Order[];
  totalCount: string | null;
  selectedId: string | null;
  error: ApiError | null;
}

export interface OrderState {
  status: LoadingStatus;
  details: OrderDetails | null;
  isCanceling: boolean;
  error: ApiError | null;
  cancelError: ApiError | null;
}

export interface FilterState {
  range: string | null;
  pickupCity: PickupCity | null;
  deliveryCity: DeliveryCity | null;
  // isActive: boolean;
}

export interface OrdersFeatureState {
  list: OrderListState;
  order: OrderState;
  pagination: PaginationState;
  filter: FilterState;
}

export const initialState: OrdersFeatureState = {
  list: {
    status: LoadingStatus.IDLE,
    orders: [],
    totalCount: null,
    selectedId: null,
    error: null,
  },
  order: {
    status: LoadingStatus.IDLE,
    details: null,
    isCanceling: false,
    error: null,
    cancelError: null,
  },
  pagination: {
    currentPage: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  filter: {
    range: null,
    pickupCity: null,
    deliveryCity: null,
    // isActive: false,
  },
};
