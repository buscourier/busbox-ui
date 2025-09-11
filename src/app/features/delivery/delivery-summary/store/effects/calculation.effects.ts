import { inject } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { combineLatest, debounceTime, filter, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { DEBOUNCE_TIME } from '@core/constants';

import type { ApiError } from '@shared/types';

import { DeliveryDetailsFacade } from '@delivery/delivery-details';
import { DeliveryPointFacade } from '@delivery/delivery-point';
import { PickupPointFacade } from '@delivery/pickup-point';

import { DeliverySummaryService } from '../../services';

import { DeliverySummaryActions } from '../actions';

export const calculationEffects = {
  setLoading: createEffect(
    (
      pickupPointFacade = inject(PickupPointFacade),
      deliveryPointFacade = inject(DeliveryPointFacade),
      deliveryDetailsFacade = inject(DeliveryDetailsFacade),
    ) => {
      return combineLatest([
        pickupPointFacade.getSelectedCity(),
        deliveryPointFacade.getSelectedCity(),
        deliveryDetailsFacade.getOrders(),
        deliveryDetailsFacade.isAllOrdersValid(),
        pickupPointFacade.getCourier(),
        deliveryPointFacade.getCourier(),
      ]).pipe(
        debounceTime(DEBOUNCE_TIME.DEFAULT),
        filter(
          ([pickupCity, deliveryCity, orders, isAllOrdersValid]) =>
            !!pickupCity?.id && !!deliveryCity?.id && orders.length > 0 && isAllOrdersValid,
        ),
        map(() => DeliverySummaryActions.loadTotalAmount()),
      );
    },
    { functional: true },
  ),

  calculateTotal: createEffect(
    (
      pickupPointFacade = inject(PickupPointFacade),
      deliveryPointFacade = inject(DeliveryPointFacade),
      deliveryDetailsFacade = inject(DeliveryDetailsFacade),
      deliverySummaryService = inject(DeliverySummaryService),
    ) => {
      return combineLatest([
        pickupPointFacade.getSelectedCity(),
        deliveryPointFacade.getSelectedCity(),
        deliveryDetailsFacade.getOrders(),
        deliveryDetailsFacade.isAllOrdersValid(),
        pickupPointFacade.getCourier(),
        deliveryPointFacade.getCourier(),
      ]).pipe(
        // debounceTime(DEBOUNCE_TIME.DEFAULT),
        // filter(
        //   ([pickupCity, deliveryCity, orders, isAllOrdersValid]) =>
        //     !!pickupCity?.id && !!deliveryCity?.id && orders.length > 0 && isAllOrdersValid,
        // ),
        switchMap(([pickupCity, deliveryCity, orders, , pickupCourier, deliveryCourier]) => {
          return deliverySummaryService
            .calculateTotalAmount({
              pickupCityId: pickupCity?.id || null,
              deliveryCityId: deliveryCity?.id || null,
              orders,
              pickupCourier,
              deliveryCourier,
            })
            .pipe(
              mapResponse({
                next: ({ price }) =>
                  DeliverySummaryActions.loadTotalAmountSuccess({ totalAmount: price }),
                error: (error: ApiError) =>
                  DeliverySummaryActions.loadTotalAmountFailure({ error }),
              }),
            );
        }),
      );
    },
    { functional: true },
  ),
};
