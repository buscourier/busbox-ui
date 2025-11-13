import { createSelector } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import type { ReviewSection } from '@delivery/types';

import { ApplicantType, type StepNumber } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const selectCurrentStepData = createSelector(
    baseSelectors.selectSteps,
    baseSelectors.selectCurrentStep,
    (steps, currentStep) => steps[currentStep],
  );

  const selectIsLegalEntity = createSelector(
    baseSelectors.selectApplicant,
    (applicant) => applicant?.applicantType === ApplicantType.LEGAL,
  );

  return {
    selectIsIdle: createSelector(
      baseSelectors.selectBookingStatus,
      (status) => status === AsyncStatus.IDLE,
    ),

    selectIsBooking: createSelector(
      baseSelectors.selectBookingStatus,
      (status) => status === AsyncStatus.LOADING,
    ),

    selectIsBookingSuccess: createSelector(
      baseSelectors.selectBookingStatus,
      (status) => status === AsyncStatus.LOADED,
    ),

    selectIsBookingFailed: createSelector(
      baseSelectors.selectBookingStatus,
      (status) => status === AsyncStatus.ERROR,
    ),

    selectStepsView: createSelector(
      baseSelectors.selectCurrentStep,
      baseSelectors.selectSteps,
      (currentStep, steps) =>
        Object.entries(steps).map(([key, value]) => ({
          ...value,
          isActive: currentStep === Number(key),
          isCompleted: Number(key) < currentStep && value.isValid,
        })),
    ),

    selectCurrentStepData,
    selectStepPath: (step: StepNumber) =>
      createSelector(baseSelectors.selectSteps, (steps) => steps[step].path),

    selectPrevStep: createSelector(
      baseSelectors.selectCurrentStep,
      selectIsLegalEntity,
      (currentStep, isLegal) => {
        const minStep = isLegal ? 2 : 1;

        return currentStep > minStep ? ((currentStep - 1) as StepNumber) : null;
      },
    ),

    selectNextStep: createSelector(
      baseSelectors.selectCurrentStep,
      baseSelectors.selectSteps,
      (currentStep, steps) =>
        steps[currentStep].isValid && currentStep < 4 ? ((currentStep + 1) as StepNumber) : null,
    ),

    selectCanAccessStep: (step: StepNumber) =>
      createSelector(
        baseSelectors.selectMaxAvailableStep,
        (maxAvailableStep) => step <= maxAvailableStep,
      ),

    selectIsLastStep: createSelector(
      baseSelectors.selectCurrentStep,
      (currentStep) => currentStep === 4,
    ),

    selectStepsValid: createSelector(
      baseSelectors.selectSteps,
      selectIsLegalEntity,
      (steps, isLegal): boolean =>
        Object.entries(steps).every(([k, s]) => (isLegal && k === '1' ? true : s.isValid)),
    ),

    selectSenderReviewSection: createSelector(
      baseSelectors.selectDeparture,
      (departure): ReviewSection => {
        const sender = departure?.sender;

        return {
          title: 'booking.departure.sender.title',
          fields: [
            { label: 'user.labels.fullName', value: sender?.fullName || 'text.noData' },
            ...(sender?.documentNumber
              ? [
                  {
                    label: 'document.labels.document',
                    value: sender?.document?.label || 'text.noData',
                  },
                  {
                    label: 'document.labels.documentNumber',
                    value: sender?.documentNumber || 'text.noData',
                  },
                ]
              : []),
            { label: 'contacts.labels.phone', value: sender?.phone || 'text.noData' },
          ],
        };
      },
    ),
    selectRecipientReviewSection: createSelector(
      baseSelectors.selectDestination,
      (destination): ReviewSection => {
        const recipient = destination?.recipient;

        return {
          title: 'booking.destination.recipient.title',
          fields: [
            { label: 'user.labels.fullName', value: recipient?.fullName || 'text.noData' },
            { label: 'contacts.labels.phone', value: recipient?.phone || 'text.noData' },
          ],
        };
      },
    ),

    selectApplicantType: createSelector(
      baseSelectors.selectApplicant,
      (applicant) => applicant?.applicantType || null,
    ),

    selectIsLegalEntity,

    selectIsCurrentStepValid: createSelector(
      selectCurrentStepData,
      (currenStep) => currenStep.isValid,
    ),
  };
};
