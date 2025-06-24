import { type AsyncState, AsyncStatus } from '@shared/types';

import type { BalanceSummary } from '../types';

export interface BalanceFeatureState {
  summary: AsyncState<BalanceSummary>;
}

export const initialState: BalanceFeatureState = {
  summary: {
    status: AsyncStatus.IDLE,
    data: null,
    error: null,
  },
};
