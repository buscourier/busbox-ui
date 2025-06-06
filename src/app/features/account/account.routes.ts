import type { Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { LayoutComponent } from './layout';

export const accountRoutes: Routes = [
  {
    path: '',
    component: AccountComponent,
    data: { title: 'Личный кабинет' },
    children: [
      {
        path: '',
        component: LayoutComponent,
        data: { title: 'Личный кабинет', hideBreadcrumb: true },
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile').then((m) => m.profileRoutes),
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders').then((c) => c.OrdersComponent),
        data: { title: 'Мои заказы' },
      },
    ],
  },
];
