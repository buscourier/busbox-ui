import type { ApiError, AsyncStatus } from '@shared/types';

export interface DeliverySummaryState {
  status: AsyncStatus;
  totalAmount: number;
  error: ApiError | null;
}
