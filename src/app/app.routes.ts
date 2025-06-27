import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'delivery',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth').then((m) => m.authRoutes),
  },
  {
    path: 'delivery',
    loadChildren: () => import('./features/delivery').then((m) => m.deliveryRoutes),
  },
  {
    path: 'account',
    loadChildren: () => import('./features/account').then((m) => m.accountRoutes),
  },
  {
    path: 'tariffs',
    loadChildren: () => import('./features/tariffs').then((m) => m.tariffsRoutes),
  },
];
