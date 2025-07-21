import { type Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { noAuthGuard } from './guards/no-auth.guard';

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
        data: { title: 'auth.pages.login' },
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register').then((c) => c.RegisterComponent),
        canActivate: [noAuthGuard],
        data: { title: 'auth.pages.register' },
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./components/forgot-password').then((c) => c.ForgotPasswordComponent),
        canActivate: [noAuthGuard],
        data: { title: 'auth.pages.forgotPassword' },
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
