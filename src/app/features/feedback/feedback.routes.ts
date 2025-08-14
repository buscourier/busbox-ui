import type { Routes } from '@angular/router';

import { FeedbackComponent } from './feedback.component';

export const feedbackRoutes: Routes = [
  {
    path: '',
    component: FeedbackComponent,
    data: { pageKey: 'feedback', hideBreadcrumbs: true },
  },
];
