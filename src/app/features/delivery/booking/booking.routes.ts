import type { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { BookingComponent } from './booking.component';
import { bookingResultGuard, stepGuard } from './guards';
import { FailureComponent, SuccessComponent } from './result';
import {
  ApplicantComponent,
  DepartureComponent,
  DestinationComponent,
  ReviewComponent,
} from './steps';
import { BookingEffects, bookingFeature } from './store';

export const bookingRoutes: Routes = [
  {
    path: '',
    component: BookingComponent,
    providers: [provideState(bookingFeature), provideEffects(BookingEffects)],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'applicant',
      },
      {
        path: 'applicant',
        component: ApplicantComponent,
        canActivate: [stepGuard],
        data: { pageKey: 'applicant' },
      },
      {
        path: 'departure',
        component: DepartureComponent,
        canActivate: [stepGuard],
      },
      {
        path: 'destination',
        component: DestinationComponent,
        canActivate: [stepGuard],
      },
      {
        path: 'review',
        component: ReviewComponent,
        canActivate: [stepGuard],
      },
      {
        path: 'success',
        component: SuccessComponent,
        canActivate: [bookingResultGuard],
      },
      {
        path: 'failure',
        component: FailureComponent,
        canActivate: [bookingResultGuard],
      },
    ],
  },
];
