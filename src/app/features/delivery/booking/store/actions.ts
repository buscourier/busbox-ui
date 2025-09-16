import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type {
  ApplicantType,
  BookingResult,
  Individual,
  Recipient,
  Sender,
  StepNumber,
  StoredBookingState,
} from '../types';

export const BookingActions = createActionGroup({
  source: 'Booking',
  events: {
    'Navigate to step': props<{ stepNumber: StepNumber }>(),
    'Update step validation': props<{ step: StepNumber; isValid: boolean }>(),
    'Restore State': props<{ restoredState: StoredBookingState }>(),
    'Set Applicant Type': props<{ applicantType: ApplicantType }>(),
    'Update Individual Data': props<{ data: Individual }>(),
    'Update Sender Data': props<{ data: Sender }>(),
    'Update Recipient Data': props<{ data: Recipient }>(),
    'Update Review': props<
      Partial<{
        comment: string | null;
        rulesAccepted: boolean;
        processingAccepted: boolean;
      }>
    >(),
    'Skip Restore': emptyProps(),
    Booking: emptyProps(),
    'Booking Success': props<{ bookingResult: BookingResult }>(),
    'Booking Failure': props<{ error: ApiError }>(),
    Init: emptyProps(),
    'Reset State': emptyProps(),
  },
});
