import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationsActions } from '@core/notifications';

import type { ApiError, Office } from '@shared/types';

import { DeliveryService } from '@delivery/services';

import { PickupPointTabType } from '../../types';

import { PickupPointActions } from '../actions';
import { pickupPointFeature } from '../feature';

export const officesEffects = {
  initOfficesLoad: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(PickupPointActions.loadCitiesSuccess),
        map(() => PickupPointActions.loadOffices()),
      );
    },
    { functional: true },
  ),
  loadOffices: createEffect(
    (actions$ = inject(Actions), deliveryService = inject(DeliveryService)) => {
      return actions$.pipe(
        ofType(PickupPointActions.loadOffices),
        switchMap(() =>
          deliveryService.getOffices().pipe(
            mapResponse({
              next: (offices: Office[]) => PickupPointActions.loadOfficesSuccess({ offices }),
              error: (error: ApiError) => PickupPointActions.loadOfficesFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
  selectDefaultOffice: createEffect(
    (actions$ = inject(Actions), store = inject(Store)) => {
      return actions$.pipe(
        ofType(PickupPointActions.setActiveTabId),
        concatLatestFrom(() => [
          store.select(pickupPointFeature.selectAvailableOffices),
          store.select(pickupPointFeature.selectSelectedOffice),
        ]),
        filter(([{ activeTabId }, offices, selectedOffice]) => {
          const isOfficeTab = activeTabId === PickupPointTabType.OFFICE;
          const hasOffices = offices.length > 0;
          const noSelectedOffice = !selectedOffice;
          return isOfficeTab && hasOffices && noSelectedOffice;
        }),
        map(([, offices]) => PickupPointActions.selectOffice({ office: offices[0] })),
      );
    },
    { functional: true },
  ),
  onLoadOfficesFailure: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(PickupPointActions.loadOfficesFailure),
        map(() => {
          return NotificationsActions.showError({
            message: 'Не удалось загрузить офисы',
          });
        }),
      );
    },
    { functional: true },
  ),

  // selectDefaultOffice: createEffect(
  //   (actions$ = inject(Actions), store = inject(Store)) => {
  //     return actions$.pipe(
  //       ofType(PickupPointActions.setActiveTabId),
  //       withLatestFrom(store.select(startPointFeature.selectAvailableOffices)),
  //       filter(
  //         ([{ activeTabId }, offices]) => offices.length > 0 && activeTabId === TabType.OFFICE,
  //       ),
  //       map(([, offices]) => PickupPointActions.selectOffice({ office: offices[0] })),
  //     );
  //   },
  //   { functional: true },
  // ),
};
