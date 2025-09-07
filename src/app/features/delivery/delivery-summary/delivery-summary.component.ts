import { animate, style, transition, trigger } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import type { OnInit, OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TUI_CONFIRM, type TuiConfirmData, TuiSkeleton } from '@taiga-ui/kit';
import { BehaviorSubject, Subject, type Observable, of, switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DeliveryLayoutService } from '@delivery/services';
import { DeliveryActions } from '@delivery/store';

import { DeliverySummaryFacade } from './delivery-summary.facade';
import type { DeliverySummaryViewModel } from './types';

@Component({
  selector: 'app-delivery-summary',
  imports: [AsyncPipe, RouterLink, TuiButton, TuiSkeleton, TuiIcon, TuiCurrencyPipe, TranslocoPipe],
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
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateY(100%)' }))]),
    ]),
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
export class DeliverySummaryComponent implements OnInit, OnDestroy {
  vm$!: Observable<DeliverySummaryViewModel>;
  isCalculatorLayout$!: Observable<boolean>;
  isSummaryVisible$ = new BehaviorSubject<boolean>(false);
  isMobile$ = new BehaviorSubject<boolean>(this.checkIsMobile());

  private readonly destroy$ = new Subject<void>();
  private store = inject(Store);
  private deliveryLayoutService = inject(DeliveryLayoutService);
  private readonly dialogs = inject(TuiResponsiveDialogService);
  private readonly deliverySummaryFacade = inject(DeliverySummaryFacade);

  ngOnInit(): void {
    this.vm$ = this.deliverySummaryFacade.getViewModel();
    this.isCalculatorLayout$ = this.deliveryLayoutService.getIsCalculatorLayout();

    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile$.next(this.checkIsMobile());
  }

  toggleSummary(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isSummaryVisible$.next(!this.isSummaryVisible$.value);
  }

  closeSummary(): void {
    this.isSummaryVisible$.next(false);
  }

  handleOutsideClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    const summaryElement = document.querySelector('.summary-drawer');
    const triggerButton = document.querySelector('.summary-trigger');

    if (
      this.isSummaryVisible$.value &&
      summaryElement &&
      !summaryElement.contains(targetElement) &&
      triggerButton &&
      !triggerButton.contains(targetElement)
    ) {
      this.closeSummary();
    }
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
            this.closeSummary();
          }

          return of(response);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  swipeDown(event: TouchEvent): void {
    const touchStartY = event.touches[0].clientY;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touchMoveY = moveEvent.touches[0].clientY;
      const distance = touchMoveY - touchStartY;

      if (distance > 100) {
        this.closeSummary();
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }

  private checkIsMobile(): boolean {
    return window.innerWidth < 1024;
  }
}
