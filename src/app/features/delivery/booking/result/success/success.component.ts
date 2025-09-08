import { AsyncPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiIcon, TuiNotification } from '@taiga-ui/core';
import { TuiCopy } from '@taiga-ui/kit';
import type { Observable } from 'rxjs';

import { NavigationService } from '@core/services';
import { CONTACT_INFO } from '@core/tokens';

import { ContactLinkPipe } from '@shared/pipes';

import { BookingFacade } from '../../booking.facade';
import type { BookingResult } from '../../types';

@Component({
  selector: 'app-success',
  imports: [AsyncPipe, RouterLink, TuiNotification, TuiIcon, TuiButton, TuiCopy, ContactLinkPipe],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessComponent implements OnInit {
  bookingResult$!: Observable<BookingResult | null>;

  private readonly bookingFacade = inject(BookingFacade);
  private readonly navigationService = inject(NavigationService);
  protected readonly contact = inject(CONTACT_INFO);

  get trackingLink(): string {
    return '/' + this.navigationService.findByLink('tracking')!.link;
  }

  ngOnInit(): void {
    this.bookingResult$ = this.bookingFacade.getBookingResult();
  }
}
