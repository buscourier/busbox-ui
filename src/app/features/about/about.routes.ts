import type { Routes } from '@angular/router';

import { AboutComponent } from './about.component';

export const aboutRoutes: Routes = [
  {
    path: '',
    component: AboutComponent,
    data: { pageKey: 'about', hideBreadcrumbs: true },
  },
];
