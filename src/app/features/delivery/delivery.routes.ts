import type { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

import { CalculatorComponent } from './calculator';
import { DeliveryComponent } from './delivery.component';
import { calculatorGuard } from './guards';

export const deliveryRoutes: Routes = [
  {
    path: '',
    component: DeliveryComponent,
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
