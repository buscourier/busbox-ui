import type { Routes } from '@angular/router';

import { authGuard } from '@core/auth';

import { NotFoundComponent } from '@shared/components/not-found';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home').then((m) => m.homeRoutes),
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
    canActivate: [authGuard],
  },
  {
    path: 'info',
    loadChildren: () => import('./features/info').then((m) => m.infoRoutes),
  },
  {
    path: 'services',
    loadChildren: () => import('./features/services').then((m) => m.servicesRoutes),
  },
  {
    path: 'tracking',
    loadChildren: () => import('./features/tracking').then((m) => m.trackingRoutes),
  },
  {
    path: 'contacts',
    loadChildren: () => import('./features/contacts').then((m) => m.contactsRoutes),
  },
  {
    path: 'news',
    loadChildren: () => import('./features/news').then((m) => m.newsRoutes),
  },
  // {
  //   path: 'about',
  //   loadChildren: () => import('./features/about').then((m) => m.aboutRoutes),
  // },
  {
    path: 'career',
    loadChildren: () => import('./features/career').then((m) => m.careerRoutes),
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./features/privacy-policy').then((m) => m.privacyPolicyRoutes),
  },
  {
    path: 'feedback',
    loadChildren: () => import('./features/feedback').then((m) => m.feedbackRoutes),
  },
  { path: '**', component: NotFoundComponent },
];
