import type { ApiError } from '@shared/types';

import type { Order, OrderDetails } from '../types';

export interface OrderListViewModel {
  isLoading: boolean;
  isLoaded: boolean;
  orders: Order[];
  totalCount: string | null;
  totalPages: number;
  selectedOrderId: string | null;
  error: ApiError | null;
}

export interface PaginationViewModel {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  isVisible: boolean;
}

export interface OrderViewModel {
  isLoading: boolean;
  isLoaded: boolean;
  isCanceling: boolean;
  details: OrderDetails | null;
  isNew: boolean;
  error: ApiError | null;
  cancelError: ApiError | null;
}

export interface OrdersViewModel {
  list: OrderListViewModel;
  order: OrderViewModel;
  pagination: PaginationViewModel;
}
