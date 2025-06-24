import type { ApiError } from '@shared/types';

import type { Errors, Filter, Order, OrderDetails, SortConfig } from '../types';

export interface OrderListViewModel {
  isLoading: boolean;
  isLoaded: boolean;
  isExporting: boolean;
  isEmpty: boolean;
  orders: Order[];
  totalCount: number;
  selectedId: string | null;
  canExport: boolean;
  pagination: PaginationViewModel;
  sort: SortConfig;
}

export interface PaginationViewModel {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  isVisible: boolean;
  startItem: number;
  endItem: number;
}

export interface FilterViewModel {
  params: Filter;
  isActive: boolean;
  isListLoading: boolean;
}

export interface OrdersExportViewModel {
  isExporting: boolean;
  error: ApiError | null;
  canExport: boolean;
}

export interface OrderViewModel {
  isLoading: boolean;
  isLoaded: boolean;
  details: OrderDetails | null;
  canCancel: boolean;
  isCanceling: boolean;
}

export interface OrdersViewModel {
  list: OrderListViewModel;
  order: OrderViewModel;
  filter: FilterViewModel;
  errors: Errors;
}
