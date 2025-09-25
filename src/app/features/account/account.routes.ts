import type { Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { LayoutComponent } from './layout';

export const accountRoutes: Routes = [
  {
    path: '',
    component: AccountComponent,
    data: { pageKey: 'account' },
    children: [
      {
        path: '',
        component: LayoutComponent,
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile').then((m) => m.profileRoutes),
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders').then((c) => c.OrdersComponent),
        data: { pageKey: 'orders' },
      },
    ],
  },
];
