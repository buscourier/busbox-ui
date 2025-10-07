import type { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { CalculatorComponent } from './calculator';
import { DeliveryDetailsEffects, deliveryDetailsFeature } from './delivery-details';
import { DeliveryPointEffects, deliveryPointFeature } from './delivery-point';
import { DeliverySummaryEffects, deliverySummaryFeature } from './delivery-summary';
import { DeliveryComponent } from './delivery.component';
import { calculatorGuard } from './guards';
import { PickupPointEffects, pickupPointFeature } from './pickup-point';

export const deliveryRoutes: Routes = [
  {
    path: '',
    component: DeliveryComponent,
    providers: [
      provideState(pickupPointFeature),
      provideState(deliveryPointFeature),
      provideState(deliveryDetailsFeature),
      provideState(deliverySummaryFeature),

      provideEffects(
        PickupPointEffects,
        DeliveryPointEffects,
        DeliveryDetailsEffects,
        DeliverySummaryEffects,
      ),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'calculator',
      },
      {
        path: 'calculator',
        component: CalculatorComponent,
        canActivate: [calculatorGuard],
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        data: { pageKey: 'calculator' },
        providers: [
          provideTranslocoScope({
            scope: 'features/delivery/calculator',
            alias: 'c',
          }),
        ],
      },
      {
        path: 'booking',
        loadChildren: () => import('./booking').then((m) => m.bookingRoutes),
      },
    ],
  },
];
