import type { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { NewsComponent } from './news.component';
import { NewsEffects, newsFeature } from './store';

export const newsRoutes: Routes = [
  {
    path: '',
    component: NewsComponent,
    // data: { pageKey: 'news', hideBreadcrumbs: true },
    providers: [provideState(newsFeature), provideEffects(NewsEffects)],
  },
];
