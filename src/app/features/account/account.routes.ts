import { type Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { AccountComponent } from './account.component';
import { BalanceEffects, balanceFeature } from './balance';
import { LayoutComponent } from './layout';
import { OrdersEffects, ordersFeature } from './orders';
import { ProfileEffects, profileFeature } from './profile';

export const accountRoutes: Routes = [
  {
    path: '',
    component: AccountComponent,
    data: { pageKey: 'account' },
    providers: [
      provideState(profileFeature),
      provideState(ordersFeature),
      provideState(balanceFeature),
      provideEffects(ProfileEffects, OrdersEffects, BalanceEffects),
    ],
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
