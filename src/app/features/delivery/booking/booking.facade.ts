import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, type Observable, take } from 'rxjs';
import { map } from 'rxjs/operators';

import type { ApiError } from '@shared/types';

import { DeliveryDetailsFacade } from '@delivery/delivery-details';
import { DeliveryPointFacade } from '@delivery/delivery-point';
import { PickupPointFacade } from '@delivery/pickup-point';
import type { ReviewSection } from '@delivery/types';

import { bookingFeature, BookingActions } from './store';
import type {
  Applicant,
  ApplicantType,
  BookingResult,
  BookingViewModel,
  Departure,
  Destination,
  Individual,
  Recipient,
  ReviewView,
  Sender,
  StepNumber,
  ReviewConfirmation,
  Step,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class BookingFacade {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly pickupPointFacade = inject(PickupPointFacade);
  private readonly deliveryPointFacade = inject(DeliveryPointFacade);
  private readonly deliveryDetailsFacade = inject(DeliveryDetailsFacade);

  init(): void {
    this.store.dispatch(BookingActions.init());
  }

  getViewModel(): Observable<BookingViewModel> {
    return this.store.select(bookingFeature.selectViewModel);
  }

  navigateToStep(step: StepNumber): void {
    this.store.dispatch(BookingActions.navigateToStep({ stepNumber: step }));

    this.store
      .select(bookingFeature.selectStepPath(step))
      .pipe(take(1))
      .subscribe((path) => {
        this.router.navigate(['/delivery/booking', path]);
      });
  }

  getCurrentStep(): Observable<StepNumber> {
    return this.store.select(bookingFeature.selectCurrentStep);
  }

  submitOrder(): void {
    this.store.dispatch(BookingActions.submitOrder());
  }

  getSteps(): Observable<Record<StepNumber, Step>> {
    return this.store.select(bookingFeature.selectSteps);
  }

  getApplicantType(): Observable<ApplicantType | null> {
    return this.store.select(bookingFeature.selectApplicantType);
  }

  getApplicant(): Observable<Applicant | null> {
    return this.store.select(bookingFeature.selectApplicant);
  }

  getDeparture(): Observable<Departure | null> {
    return this.store.select(bookingFeature.selectDeparture);
  }

  getDestination(): Observable<Destination | null> {
    return this.store.select(bookingFeature.selectDestination);
  }

  getSenderReviewSection(): Observable<ReviewSection> {
    return this.store.select(bookingFeature.selectSenderReviewSection);
  }

  getRecipientReviewSection(): Observable<ReviewSection> {
    return this.store.select(bookingFeature.selectRecipientReviewSection);
  }

  getReview(): Observable<ReviewView> {
    return combineLatest([
      this.pickupPointFacade.getReviewSection(),
      this.deliveryPointFacade.getReviewSection(),
      this.getSenderReviewSection(),
      this.getRecipientReviewSection(),
      this.deliveryDetailsFacade.getOrderReviewDetails(),
    ]).pipe(
      map(([pickupSection, deliverySection, senderSection, recipientSection, order]) => ({
        sections: [pickupSection, deliverySection, senderSection, recipientSection],
        order,
      })),
    );
  }

  getReviewConfirmation(): Observable<ReviewConfirmation> {
    return this.store.select(bookingFeature.selectReviewConfirmation);
  }

  getBookingResult(): Observable<BookingResult | null> {
    return this.store.select(bookingFeature.selectBookingResult);
  }

  getBookingError(): Observable<ApiError | null> {
    return this.store.select(bookingFeature.selectError);
  }

  updateIndividual(data: Individual): void {
    this.store.dispatch(BookingActions.updateIndividualData({ data }));
  }

  updateSender(data: Sender): void {
    this.store.dispatch(BookingActions.updateSenderData({ data }));
  }

  updateRecipient(data: Recipient): void {
    this.store.dispatch(BookingActions.updateRecipientData({ data }));
  }

  updateReview(
    reviewData: Partial<{
      comment: string | null;
      rulesAccepted: boolean;
      processingAccepted: boolean;
    }>,
  ): void {
    this.store.dispatch(BookingActions.updateReview(reviewData));
  }

  updateApplicantType(applicantType: ApplicantType): void {
    this.store.dispatch(BookingActions.setApplicantType({ applicantType }));
  }

  updateStepValidation(isValid: boolean, step: StepNumber): void {
    this.store.dispatch(
      BookingActions.updateStepValidation({
        step,
        isValid,
      }),
    );
  }

  resetState(): void {
    this.store.dispatch(BookingActions.resetState());
  }

  isLegalEntity(): Observable<boolean> {
    return this.store.select(bookingFeature.selectIsLegalEntity);
  }

  isCurrentStepValid(): Observable<boolean> {
    return this.store.select(bookingFeature.selectIsCurrentStepValid);
  }
}
