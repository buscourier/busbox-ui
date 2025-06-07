import { type ApiError, LoadingStatus, type Pagination } from '@shared/types';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';
import type { Filter, Order, OrderDetails } from '../types';

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

export interface OrdersFeatureState {
  list: OrderListState;
  order: OrderState;
  pagination: Pagination;
  filter: Filter;
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
  },
};
