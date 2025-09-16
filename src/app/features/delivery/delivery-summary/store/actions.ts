import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type { TotalAmountParams } from '@delivery/delivery-summary/types';

export const DeliverySummaryActions = createActionGroup({
  source: 'DeliverySummary',
  events: {
    'Calculate Total Amount': props<{
      dto: TotalAmountParams;
    }>(),
    'Calculate Total Amount Success': props<{ totalAmount: number }>(),
    'Calculate Total Amount Failure': props<{ error: ApiError }>(),
    'Clear Calculation': emptyProps(),
    'Reset State': emptyProps(),
  },
});
