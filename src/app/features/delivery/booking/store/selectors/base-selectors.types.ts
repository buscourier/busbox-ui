import type { MemoizedSelector } from '@ngrx/store';

import type { ApiError, AsyncStatus } from '@shared/types';

import type {
  Applicant,
  BookingResult,
  Departure,
  Destination,
  Review,
  ReviewConfirmation,
  Step,
  StepNumber,
} from '../../types';

export interface BaseSelectors {
  selectCurrentStep: MemoizedSelector<object, StepNumber>;
  selectSteps: MemoizedSelector<object, Record<StepNumber, Step>>;
  selectMaxAvailableStep: MemoizedSelector<object, StepNumber>;
  selectApplicant: MemoizedSelector<object, Applicant | null>;
  selectDeparture: MemoizedSelector<object, Departure | null>;
  selectDestination: MemoizedSelector<object, Destination | null>;
  selectReview: MemoizedSelector<object, Review>;
  selectReviewConfirmation: MemoizedSelector<object, ReviewConfirmation>;
  selectBookingStatus: MemoizedSelector<object, AsyncStatus>;
  selectError: MemoizedSelector<object, ApiError | null>;
  selectBookingResult: MemoizedSelector<object, BookingResult | null>;
}
