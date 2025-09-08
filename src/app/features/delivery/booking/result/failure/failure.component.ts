import { AsyncPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiNotification } from '@taiga-ui/core';
import { TuiCopyComponent } from '@taiga-ui/kit';
import type { Observable } from 'rxjs';

import { CONTACT_INFO } from '@core/tokens';

import { ContactLinkPipe } from '@shared/pipes';
import type { ApiError } from '@shared/types';

import { BookingFacade } from '../../booking.facade';

@Component({
  selector: 'app-failure',
  imports: [
    AsyncPipe,
    RouterLink,
    ContactLinkPipe,
    TuiButton,
    TuiCopyComponent,
    TuiIcon,
    TuiNotification,
  ],
  templateUrl: './failure.component.html',
  styleUrl: './failure.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FailureComponent implements OnInit {
  error$!: Observable<ApiError | null>;

  readonly bookingFacade = inject(BookingFacade);
  protected readonly contact = inject(CONTACT_INFO);

  ngOnInit(): void {
    this.error$ = this.bookingFacade.getBookingError();
  }
}
