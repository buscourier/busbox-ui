import { AsyncPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import type { Observable } from 'rxjs';

import { PageLayoutComponent } from '@shared/layouts/page-layout';

import { DeliverySummaryComponent } from '@delivery/delivery-summary';

import { DeliveryLayoutService } from './services';

@Component({
  selector: 'app-delivery',
  imports: [RouterOutlet, AsyncPipe, DeliverySummaryComponent, PageLayoutComponent],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryComponent implements OnInit {
  isMainLayout$!: Observable<boolean>;

  private layoutService = inject(DeliveryLayoutService);
  private readonly router = inject(Router);

  get isBookingPage(): boolean {
    return this.router.url.includes('booking');
  }

  ngOnInit(): void {
    this.isMainLayout$ = this.layoutService.getIsMainLayout();
  }
}
