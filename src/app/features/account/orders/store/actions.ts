import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type {
  UrlParams,
  CancelOrderPayload,
  CancelOrderResponse,
  Filter,
  OrderDetails,
  OrderListPayload,
  OrderListResponse,
} from '../types';

export const OrdersActions = createActionGroup({
  source: 'Account/Orders',
  events: {
    'Get Order List': props<{ payload: OrderListPayload }>(),
    'Get Order List Success': props<{ response: OrderListResponse }>(),
    'Get Order List Failure': props<{ error: ApiError }>(),

    'Select Order': props<{ orderId: string }>(),
    'Clear Selection': emptyProps(),

    'Get Order': props<{ orderId: string }>(),
    'Get Order Success': props<{ details: OrderDetails }>(),
    'Get Order Failure': props<{ error: ApiError }>(),

    'Cancel Order': props<{ payload: CancelOrderPayload }>(),
    'Cancel Order Success': props<{ response: CancelOrderResponse }>(),
    'Cancel Order Failure': props<{ error: ApiError }>(),

    'Set Current Page': props<{ page: number }>(),
    'Set Page Size': props<{ pageSize: number }>(),
    'Go To Next Page': emptyProps(),
    'Go To Previous Page': emptyProps(),

    'Set Filter': props<{ filter: Partial<Filter> }>(),
    'Clear Filter': emptyProps(),
    'Apply Filter': props<{ filter: Filter }>(),

    'Restore From Url': props<{ params: Partial<UrlParams> }>(),
  },
});
