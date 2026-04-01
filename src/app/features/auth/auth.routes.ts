import type { Routes } from '@angular/router';

import { noAuthGuard } from '@core/auth';

import { AuthComponent } from './auth.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./components/login').then((c) => c.LoginComponent),
        canActivate: [noAuthGuard],
        data: { pageKey: 'login' },
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register').then((c) => c.RegisterComponent),
        canActivate: [noAuthGuard],
        data: { pageKey: 'register' },
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./components/forgot-password').then((c) => c.ForgotPasswordComponent),
        canActivate: [noAuthGuard],
        data: { pageKey: 'forgot-password' },
      },
      // {
      //   path: 'reset-password',
      //   loadComponent: () =>
      //     import('./components/reset-password/reset-password.component').then(
      //       (c) => c.ResetPasswordComponent,
      //     ),
      //   canActivate: [noAuthGuard],
      // },
    ],
  },
];
