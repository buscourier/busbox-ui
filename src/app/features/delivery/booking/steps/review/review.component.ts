import { AsyncPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { TuiIcon } from '@taiga-ui/core';
import { TuiLineClamp } from '@taiga-ui/kit';
import type { Observable } from 'rxjs';

import { BookingFacade } from '../../booking.facade';
import type { ReviewView } from '../../types';

import { ReviewConfirmationComponent } from './review-confirmation';

@Component({
  selector: 'app-review',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    ReviewConfirmationComponent,
    TuiIcon,
    TranslocoPipe,
    TuiLineClamp,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
  providers: [
    provideTranslocoScope(
      {
        scope: 'features/delivery/pickup-point',
        alias: 'pickupPoint',
      },
      {
        scope: 'features/delivery/delivery-point',
        alias: 'deliveryPoint',
      },
    ),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent implements OnInit {
  review$!: Observable<ReviewView>;

  private readonly bookingFacade = inject(BookingFacade);

  ngOnInit(): void {
    this.review$ = this.bookingFacade.getReview();
  }
}
