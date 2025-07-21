import type { Routes } from '@angular/router';

import { TrackingComponent } from './tracking.component';

export const trackingRoutes: Routes = [
  {
    path: '',
    component: TrackingComponent,
    data: { pageKey: 'tracking' },
  },
];
