import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type {
  QueryParams,
  CancelOrderResponse,
  Filter,
  OrderDetails,
  OrderListPayload,
  OrderListResponse,
  SortConfig,
} from '../types';

export const OrdersActions = createActionGroup({
  source: 'Account/Orders',
  events: {
    'Load List': props<{ payload: OrderListPayload }>(),
    'Load List Success': props<{ response: OrderListResponse }>(),
    'Load List Failure': props<{ error: ApiError }>(),

    'Export To Excel': emptyProps(),
    'Export To Excel Success': props<{ response: OrderListResponse }>(),
    'Export To Excel Failure': props<{ error: ApiError }>(),

    'Select Order': props<{ orderId: string }>(),
    'Clear Selection': emptyProps(),

    'Load Details': props<{ orderId: string }>(),
    'Load Details Success': props<{ data: OrderDetails }>(),
    'Load Details Failure': props<{ error: ApiError }>(),

    Cancel: props<{ orderId: string }>(),
    'Cancel Success': props<{ response: CancelOrderResponse }>(),
    'Cancel Failure': props<{ error: ApiError }>(),

    'Set page': props<{ page: number }>(),
    'Set Page Size': props<{ pageSize: number }>(),

    'Set Filter': props<{ filter: Filter }>(),
    'Clear Filter': emptyProps(),

    'Restore From Url': props<{ params: Partial<QueryParams> }>(),

    'Set Sort': props<{ sort: SortConfig }>(),
    'Clear Sort': emptyProps(),
  },
});
