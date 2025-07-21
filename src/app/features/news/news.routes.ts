import type { Routes } from '@angular/router';

import { NewsComponent } from './news.component';

export const newsRoutes: Routes = [
  {
    path: '',
    component: NewsComponent,
    data: { pageKey: 'news', hideBreadcrumbs: true },
  },
];
