import type { ApiError, AsyncStatus } from '@shared/types';

import type { BookingResult, Step, StepNumber, StepsData } from '../types';

export interface BookingState {
  currentStep: StepNumber;
  maxAvailableStep: StepNumber;
  steps: Record<StepNumber, Step>;
  stepsData: StepsData;
  error: ApiError | null;
  status: AsyncStatus;
  bookingResult: BookingResult | null;
}
