import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, switchMap, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { DeliveryPointActions } from '../actions';
import { deliveryPointFeature } from '../feature';

export const tabEffects = {
  selectDefaultTab: createEffect(
    (actions$ = inject(Actions), store = inject(Store)) => {
      return actions$.pipe(
        ofType(DeliveryPointActions.selectCity),
        switchMap(() =>
          combineLatest([
            store.select(deliveryPointFeature.selectTabs),
            store.select(deliveryPointFeature.selectActiveTabId),
          ]),
        ),
        filter(
          ([tabs, activeTabId]) =>
            tabs.length > 0 && (!activeTabId || !tabs.some((tab) => tab.id === activeTabId)),
        ),
        map(([tabs]) => {
          const defaultTab = tabs.find((tab) => tab.isDefault) || tabs[0];
          return DeliveryPointActions.setActiveTabId({ activeTabId: defaultTab.id });
        }),
      );
    },
    { functional: true },
  ),
};
