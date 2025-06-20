import { createEntityAdapter, type EntityState } from '@ngrx/entity';

import type { ApiError, Pagination, AsyncState } from '@shared/types';
import { AsyncStatus } from '@shared/types';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';
import {
  type Filter,
  type Order,
  type OrderDetails,
  type SortConfig,
  SortDirectionEnum,
} from '../types';

export interface OrderListState extends EntityState<Order> {
  status: AsyncStatus;
  totalCount: number;
  selectedId: string | null;
  error: ApiError | null;
}

// export interface OrderDetailsState {
//   status: AsyncStatus;
//   data: Record<string, OrderDetails>;
//   error: ApiError | null;
// }

export interface OrderDetailsState {
  status: AsyncStatus;
  data: OrderDetails | null;
  error: ApiError | null;
}

export interface OrderOperationsState {
  cancel: AsyncState<Record<string, boolean>>;
  export: AsyncState<boolean>;
}

export interface QueryState {
  filter: Filter;
  pagination: Pagination;
  sort: SortConfig;
}

export interface OrdersFeatureState {
  list: OrderListState;
  details: OrderDetailsState;
  operations: OrderOperationsState;
  query: QueryState;
}

export const adapter = createEntityAdapter<Order>({
  selectId: (order: Order) => order.order_id,
  // sortComparer: (a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime(),
});

export const initialState: OrdersFeatureState = {
  list: adapter.getInitialState({
    status: AsyncStatus.IDLE,
    totalCount: 0,
    selectedId: null,
    error: null,
  }),
  details: {
    status: AsyncStatus.IDLE,
    data: null,
    error: null,
  },
  operations: {
    cancel: {
      status: AsyncStatus.IDLE,
      data: {},
      error: null,
    },
    export: {
      status: AsyncStatus.IDLE,
      data: false,
      error: null,
    },
  },
  query: {
    filter: {
      range: null,
      pickupCity: null,
      deliveryCity: null,
    },
    pagination: {
      currentPage: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    },
    sort: {
      field: null,
      direction: SortDirectionEnum.NONE,
    },
  },
};
