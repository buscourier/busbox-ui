import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, filter, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { PickupPointActions } from '../actions';
import { pickupPointFeature } from '../feature';

export const tabEffects = {
  selectDefaultTab: createEffect(
    (actions$ = inject(Actions), store = inject(Store)) => {
      return actions$.pipe(
        ofType(PickupPointActions.selectCity),
        switchMap(() =>
          combineLatest([
            store.select(pickupPointFeature.selectTabs),
            store.select(pickupPointFeature.selectActiveTabId),
          ]),
        ),
        filter(([tabs, activeTabId]) => {
          return tabs.length > 0 && (!activeTabId || !tabs.some((tab) => tab.id === activeTabId));
        }),
        map(([tabs]) => {
          const defaultTab = tabs.find((tab) => tab.isDefault) || tabs[0];
          return PickupPointActions.setActiveTabId({ activeTabId: defaultTab.id });
        }),
      );
    },
    { functional: true },
  ),
};
