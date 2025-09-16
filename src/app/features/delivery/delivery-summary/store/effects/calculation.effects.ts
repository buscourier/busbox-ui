import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { combineLatest, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { DEBOUNCE_TIME } from '@core/constants';

import type { ApiError } from '@shared/types';

import { DeliveryDetailsFacade } from '@delivery/delivery-details';
import { DeliveryPointFacade } from '@delivery/delivery-point';
import type { TotalAmountParams } from '@delivery/delivery-summary/types';
import { PickupPointFacade } from '@delivery/pickup-point';

import { DeliverySummaryService } from '../../services';

import { DeliverySummaryActions } from '../actions';

interface CalculateAction {
  type: string;
  dto?: TotalAmountParams;
}

export const calculationEffects = {
  validateAndTriggerCalculation: createEffect(
    (
      pickupPointFacade = inject(PickupPointFacade),
      deliveryPointFacade = inject(DeliveryPointFacade),
      deliveryDetailsFacade = inject(DeliveryDetailsFacade),
    ) => {
      return combineLatest([
        pickupPointFacade.isComplete(),
        deliveryPointFacade.isComplete(),
        deliveryDetailsFacade.isAllOrdersValid(),
        deliveryDetailsFacade.getOrders(),
        pickupPointFacade.getSelectedCity(),
        deliveryPointFacade.getSelectedCity(),
        pickupPointFacade.getCourier(),
        deliveryPointFacade.getCourier(),
      ]).pipe(
        debounceTime(DEBOUNCE_TIME.DEFAULT),
        // filter(
        //   ([isPickupPointComplete, isDeliveryPointComplete, isAllOrdersValid, orders]) =>
        //     isPickupPointComplete &&
        //     isDeliveryPointComplete &&
        //     orders.length > 0 &&
        //     isAllOrdersValid,
        // ),
        map(
          ([
            isPickupPointComplete,
            isDeliveryPointComplete,
            isAllOrdersValid,
            orders,
            pickupCity,
            deliveryCity,
            pickupCourier,
            deliveryCourier,
          ]) => {
            const canCalculate =
              isPickupPointComplete &&
              isDeliveryPointComplete &&
              orders.length > 0 &&
              isAllOrdersValid;

            if (!canCalculate) return DeliverySummaryActions.clearCalculation();

            return DeliverySummaryActions.calculateTotalAmount({
              dto: {
                pickupCityId: pickupCity?.id || null,
                deliveryCityId: deliveryCity?.id || null,
                pickupCourier,
                deliveryCourier,
                orders,
              },
            });
          },
        ),
        distinctUntilChanged((a: CalculateAction, b: CalculateAction) => {
          if (a.type !== b.type) return false;
          if (a.type === DeliverySummaryActions.clearCalculation.type) return true;
          return JSON.stringify(a.dto) === JSON.stringify(b.dto);
        }),
      );
    },
    { functional: true },
  ),

  calculateTotal: createEffect(
    (actions$ = inject(Actions), deliverySummaryService = inject(DeliverySummaryService)) => {
      return actions$.pipe(
        ofType(DeliverySummaryActions.calculateTotalAmount),
        switchMap(({ dto }) => {
          return deliverySummaryService.calculateTotalAmount(dto).pipe(
            mapResponse({
              next: ({ price }) =>
                DeliverySummaryActions.calculateTotalAmountSuccess({ totalAmount: price }),
              error: (error: ApiError) =>
                DeliverySummaryActions.calculateTotalAmountFailure({ error }),
            }),
          );
        }),
      );
    },
    { functional: true },
  ),
};
