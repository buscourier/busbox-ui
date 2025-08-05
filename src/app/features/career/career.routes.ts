import type { Routes } from '@angular/router';

import { CareerComponent } from './career.component';

export const careerRoutes: Routes = [
  {
    path: '',
    component: CareerComponent,
    data: { pageKey: 'career', hideBreadcrumbs: true },
  },
];
