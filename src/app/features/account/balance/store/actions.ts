import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type { BalanceSummary } from '../types';

export const BalanceActions = createActionGroup({
  source: 'Account/Balance',
  events: {
    'Load Summary': emptyProps(),
    'Load Summary Success': props<{ data: BalanceSummary }>(),
    'Load Summary Failure': props<{ error: ApiError }>(),
  },
});
