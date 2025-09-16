import type { MemoizedSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';

import type { BookingState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type BookingStateSelector = MemoizedSelector<object, BookingState>;

export const createBaseSelectors = (selectBookingState: BookingStateSelector): BaseSelectors => {
  const selectStepsData = createSelector(selectBookingState, (state) => state.stepsData);
  const selectReview = createSelector(selectStepsData, (data) => data.review);

  return {
    selectCurrentStep: createSelector(selectBookingState, (state) => state.currentStep),
    selectSteps: createSelector(selectBookingState, (state) => state.steps),
    selectMaxAvailableStep: createSelector(selectBookingState, (state) => state.maxAvailableStep),
    selectApplicant: createSelector(selectStepsData, (data) => data.applicant),
    selectDeparture: createSelector(selectStepsData, (data) => data.departure),
    selectDestination: createSelector(selectStepsData, (data) => data.destination),
    selectReview,
    selectReviewConfirmation: createSelector(selectReview, (review) => review.confirmation),
    selectBookingStatus: createSelector(selectBookingState, (state) => state.status),
    selectError: createSelector(selectBookingState, (state) => state.error),
    selectBookingResult: createSelector(selectBookingState, (state) => state.bookingResult),
  };
};
