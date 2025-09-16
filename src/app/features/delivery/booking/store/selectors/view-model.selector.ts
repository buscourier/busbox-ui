import { createSelector } from '@ngrx/store';

import type { BookingViewModel } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createViewModelSelector = (
  baseSelectors: BaseSelectors,
  derivedSelectors: DerivedSelectors,
) => ({
  selectViewModel: createSelector(
    baseSelectors.selectCurrentStep,
    derivedSelectors.selectStepsView,
    derivedSelectors.selectPrevStep,
    derivedSelectors.selectNextStep,
    derivedSelectors.selectIsLastStep,
    derivedSelectors.selectStepsValid,
    derivedSelectors.selectIsBooking,
    (
      currentStep,
      steps,
      prevStep,
      nextStep,
      isLastStep,
      stepsValid,
      isBooking,
    ): BookingViewModel => ({
      currentStep,
      steps,
      prevStep,
      nextStep,
      isLastStep,
      stepsValid,
      isBooking,
    }),
  ),
});
