import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { TuiAlertService, tuiDialog } from '@taiga-ui/core';
import { finalize, type Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { FilterComponent } from './components/filter';
import { OrderDetailsDialogComponent } from './components/order-details-dialog';
import { OrderInvoiceDialogComponent } from './components/order-invoice-dialog';
import { OrderListComponent } from './components/order-list';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  FILTER_QUERY_PARAMS,
  PAGE_SIZE_OPTIONS,
} from './constants';
import { OrdersFacade } from './orders.facade';
import type { OrdersViewModel, Filter, QueryParams } from './types';

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe, FilterComponent, OrderListComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit, OnDestroy {
  vm$!: Observable<OrdersViewModel>;

  orderDetailsDialog = tuiDialog(OrderDetailsDialogComponent, {
    closeable: true,
    dismissible: true,
    size: 's',
  });

  orderInvoiceDialog = tuiDialog(OrderInvoiceDialogComponent, {
    closeable: true,
    dismissible: true,
    size: 'auto',
  });

  private readonly MODAL_PARAMS = ['orderId', 'invoiceId'] as const;
  private readonly ordersFacade = inject(OrdersFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alerts = inject(TuiAlertService);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyDialog$ = new Subject<void>();

  private isOrderModalOpen = false;
  private isInvoiceModalOpen = false;

  ngOnInit(): void {
    this.vm$ = this.ordersFacade.getViewModel();
    this.initializeUrl();
    this.setupErrorHandling();

    window.addEventListener('popstate', this.handlePopState.bind(this));
    this.syncModalStateWithUrl();
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.handlePopState.bind(this));
  }

  setFilter(filter: Filter): void {
    this.updateUrlWithFilter(filter);
  }

  clearFilter() {
    this.setUrlToDefaults();
  }

  showOrderDetails(orderId: string): void {
    this.showModalWithUrl(this.orderDetailsDialog.bind(this), orderId);
  }

  showOrderInvoice(orderId: string): void {
    this.showModalWithUrl(this.orderInvoiceDialog.bind(this), orderId, 'invoiceId');
  }

  onPageSizeChange(pageSize: number): void {
    const validatedPageSize = PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE;

    this.updateUrl({
      [FILTER_QUERY_PARAMS.PAGE]: DEFAULT_PAGE,
      [FILTER_QUERY_PARAMS.PAGE_SIZE]: validatedPageSize,
    });
  }

  navigateToPage(page: number): void {
    this.updateUrl({ [FILTER_QUERY_PARAMS.PAGE]: page });
  }

  onExportToExcel(): void {
    this.ordersFacade.exportOrdersToExcel();
  }

  private setUrlToDefaults(): void {
    const defaultParams: Partial<QueryParams> = {
      page: DEFAULT_PAGE,
      size: DEFAULT_PAGE_SIZE,
    };

    this.router.navigate([], {
      queryParams: defaultParams,
      replaceUrl: true,
    });
  }

  private initializeUrl(): void {
    const queryParams = this.route.snapshot.queryParams;

    if (Object.keys(queryParams).length === 0) {
      this.setUrlToDefaults();
    }
  }

  private updateUrlWithFilter(filter: Filter): void {
    const queryParams: Partial<QueryParams> = {
      [FILTER_QUERY_PARAMS.PAGE]: DEFAULT_PAGE,
    };

    if (filter.pickupCity?.id) {
      queryParams[FILTER_QUERY_PARAMS.PICKUP_CITY] = filter.pickupCity.id;
    }

    if (filter.deliveryCity?.id) {
      queryParams[FILTER_QUERY_PARAMS.DELIVERY_CITY] = filter.deliveryCity.id;
    }

    if (filter.range) {
      queryParams[FILTER_QUERY_PARAMS.DATE_RANGE] = filter.range;
    }

    this.updateUrl(queryParams);
  }

  private updateUrl(params: Partial<QueryParams>): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: false,
    });
  }

  private showModalWithUrl(
    modalFn: (id: string) => Observable<unknown>,
    orderId: string,
    paramName = 'orderId',
  ): void {
    const url = new URL(window.location.href);

    this.clearAllModalParams(url);

    url.searchParams.set(paramName, orderId);
    window.history.pushState({}, '', url.toString());

    modalFn(orderId)
      .pipe(
        takeUntil(this.destroyDialog$),
        finalize(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete(paramName);
          window.history.replaceState({}, '', url.toString());

          if (paramName === 'orderId') this.isOrderModalOpen = false;
          if (paramName === 'invoiceId') this.isInvoiceModalOpen = false;
        }),
      )
      .subscribe();
  }

  private clearAllModalParams(url: URL): void {
    this.MODAL_PARAMS.forEach((param) => {
      url.searchParams.delete(param);
    });
  }

  private handlePopState(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const hasAnyModalParam = this.MODAL_PARAMS.some((param) => urlParams.has(param));

    if (!hasAnyModalParam) {
      this.destroyDialog$.next();
    }
  }

  private syncModalStateWithUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const orderId = urlParams.get('orderId');
    const invoiceId = urlParams.get('invoiceId');

    if (orderId && !this.isOrderModalOpen) {
      this.showOrderDetails(orderId);
    } else if (invoiceId && !this.isInvoiceModalOpen) {
      this.showOrderInvoice(invoiceId);
    }
  }

  private setupErrorHandling(): void {
    this.vm$
      .pipe(
        map((vm) => vm.errors),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((error) => {
        if (error.list) {
          this.showErrorNotification('Не удалось загрузить список заказов');
        }

        if (error.details) {
          this.showErrorNotification('Не удалось загрузить детали заказа');
          this.destroyDialog$.next();
        }

        if (error.cancel) {
          this.showErrorNotification('Не удалось отменить заказ');
        }

        if (error.export) {
          this.showErrorNotification('Не удалось экспортировать заказы');
        }
      });
  }

  private showErrorNotification(message: string): void {
    this.alerts
      .open(message, {
        label: this.transloco.translate('alert.labels.error'),
        autoClose: 0,
        appearance: 'error',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
