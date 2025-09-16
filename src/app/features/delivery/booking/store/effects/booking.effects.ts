import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { debounceTime, delay, switchMap, tap, withLatestFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { DEBOUNCE_TIME } from '@core/constants';

import type { ApiError } from '@shared/types';

import { DeliveryDetailsFacade } from '@delivery/delivery-details';
import { DeliveryPointFacade } from '@delivery/delivery-point';
import { PickupPointFacade } from '@delivery/pickup-point';
import { DeliveryActions } from '@delivery/store';

import { BookingService } from '../../services';

import { BookingActions } from '../actions';
import { bookingFeature } from '../feature';

export const bookingEffects = {
  submitOrder: createEffect(
    (
      actions$ = inject(Actions),
      store = inject(Store),
      pickupPointFacade = inject(PickupPointFacade),
      deliveryPointFacade = inject(DeliveryPointFacade),
      deliveryDetailsFacade = inject(DeliveryDetailsFacade),
      bookingService = inject(BookingService),
    ) => {
      return actions$.pipe(
        ofType(BookingActions.booking),
        debounceTime(DEBOUNCE_TIME.DEFAULT),
        withLatestFrom(
          pickupPointFacade.getSelectedCity(),
          pickupPointFacade.getSelectedOffice(),
          pickupPointFacade.getCourier(),
          deliveryPointFacade.getSelectedCity(),
          deliveryPointFacade.getSelectedOffice(),
          deliveryPointFacade.getCourier(),
          deliveryPointFacade.getBusPickup(),
          pickupPointFacade.getDepartureDate(),
          store.select(bookingFeature.selectDeparture),
          store.select(bookingFeature.selectDestination),
          store.select(bookingFeature.selectReview),
          deliveryDetailsFacade.getOrders(),
        ),
        switchMap(
          ([
            ,
            pickupCity,
            pickupOffice,
            pickupCourier,
            deliveryCity,
            deliveryOffice,
            deliveryCourier,
            busPickup,
            departureDate,
            departure,
            destination,
            review,
            orders,
          ]) => {
            const order = orders[0];

            const pickupNote = pickupCourier
              ? ``
              : `Место отправления: ${pickupCity?.name}, ${pickupOffice?.address}`;

            const deliveryNote = pickupCourier
              ? ``
              : busPickup
                ? `Место получения: ${deliveryCity?.name}, забрать с автобуса.`
                : `Место получения: ${deliveryCity?.name}, ${deliveryOffice?.address}`;

            const note = [review.confirmation.comment, pickupNote, deliveryNote].join('. ');

            return bookingService
              .submitOrder({
                pickupCity,
                pickupCourier,
                deliveryCity,
                deliveryCourier,
                departureDate,
                departure,
                destination,
                order,
                note,
              })
              .pipe(
                mapResponse({
                  next: (bookingResult) => BookingActions.bookingSuccess({ bookingResult }),
                  error: (error: ApiError) => BookingActions.bookingFailure({ error }),
                }),
              );
          },
        ),
      );
    },
    { functional: true },
  ),
  goToSuccess: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(BookingActions.bookingSuccess),
        tap(() => router.navigate(['/delivery/booking/success'])),
      );
    },
    { functional: true, dispatch: false },
  ),

  resetOnSuccess: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(BookingActions.bookingSuccess),
        delay(0),
        map(() => DeliveryActions.resetDelivery()),
      );
    },
    { functional: true },
  ),
  goToFailure: createEffect(
    (actions$ = inject(Actions), router = inject(Router)) => {
      return actions$.pipe(
        ofType(BookingActions.bookingFailure),
        tap(() => router.navigate(['/delivery/booking/failure'])),
      );
    },
    { functional: true, dispatch: false },
  ),
};
