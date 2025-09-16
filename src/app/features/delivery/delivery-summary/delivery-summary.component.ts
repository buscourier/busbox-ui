import { animate, style, transition, trigger } from '@angular/animations';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { DestroyRef, type OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, HostListener } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import {
  TuiResponsiveDialogService,
  TuiSheetDialog,
  type TuiSheetDialogOptions,
} from '@taiga-ui/addon-mobile';
import { TuiButton, TuiIcon, TuiNotification } from '@taiga-ui/core';
import { TUI_CONFIRM, type TuiConfirmData, TuiSkeleton } from '@taiga-ui/kit';
import { BehaviorSubject, type Observable, of, switchMap } from 'rxjs';

import { DeliveryDetailsFacade } from '@delivery/delivery-details';
import { DeliveryPointFacade } from '@delivery/delivery-point';
import { PickupPointFacade } from '@delivery/pickup-point';
import { DeliveryLayoutService } from '@delivery/services';
import { DeliveryActions } from '@delivery/store';

import { DeliverySummaryFacade } from './delivery-summary.facade';
import type { DeliverySummaryViewModel } from './types';

@Component({
  selector: 'app-delivery-summary',
  imports: [
    AsyncPipe,
    RouterLink,
    TuiButton,
    TuiSkeleton,
    TuiIcon,
    TuiCurrencyPipe,
    TranslocoPipe,
    TuiSheetDialog,
    NgTemplateOutlet,
    TuiNotification,
  ],
  templateUrl: './delivery-summary.component.html',
  styleUrl: './delivery-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      {
        scope: 'features/delivery/delivery-details',
        alias: 'deliveryDetails',
      },
      {
        scope: 'features/delivery/delivery-summary',
        alias: 'summary',
      },
    ),
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
  host: {
    class: 'block relative z-10',
  },
})
export class DeliverySummaryComponent implements OnInit {
  vm$!: Observable<DeliverySummaryViewModel>;
  isCalculatorLayout$!: Observable<boolean>;
  isMobile$ = new BehaviorSubject<boolean>(this.checkIsMobile());

  readonly pickupPoint = inject(PickupPointFacade);
  readonly deliveryPoint = inject(DeliveryPointFacade);
  readonly deliveryDetails = inject(DeliveryDetailsFacade);

  protected summaryOpen = false;
  protected readonly summaryOptions: Partial<TuiSheetDialogOptions> = {
    label: 'Расчет',
  };

  private store = inject(Store);
  private deliveryLayout = inject(DeliveryLayoutService);
  private readonly dialogs = inject(TuiResponsiveDialogService);
  private readonly deliverySummary = inject(DeliverySummaryFacade);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.vm$ = this.deliverySummary.getViewModel();
    this.isCalculatorLayout$ = this.deliveryLayout.getIsCalculatorLayout();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile$.next(this.checkIsMobile());
  }

  protected onReset(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const data: TuiConfirmData = {
      content: 'Вся информация о заказе будет удалена!',
      yes: 'Да',
      no: 'Нет',
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Вы уверены?',
        size: 's',
        data,
      })
      .pipe(
        switchMap((response) => {
          if (response) {
            this.store.dispatch(DeliveryActions.resetDelivery());
            this.summaryOpen = false;
          }

          return of(response);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private checkIsMobile(): boolean {
    return window.innerWidth < 1024;
  }

  goToBooking(): void {
    this.router.navigateByUrl('/delivery/booking');
    this.summaryOpen = false;
  }
}
