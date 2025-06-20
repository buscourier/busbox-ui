import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { TuiAlertService, tuiDialog } from '@taiga-ui/core';
import { type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { type ModalConfig, ModalService } from '@core/services/modal.service';

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
import {
  type OrdersViewModel,
  type Filter,
  type QueryParams,
  sortDirectionToString,
  type SortConfig,
} from './types';

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe, FilterComponent, OrderListComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
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

  private readonly ordersFacade = inject(OrdersFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alerts = inject(TuiAlertService);
  private readonly transloco = inject(TranslocoService);
  private readonly modalService = inject(ModalService);
  private readonly store = inject(Store);

  private readonly modalConfigs: Record<string, ModalConfig> = {
    orderId: {
      paramName: 'orderId',
      modalFn: this.orderDetailsDialog.bind(this),
    },
    invoiceId: {
      paramName: 'invoiceId',
      modalFn: this.orderInvoiceDialog.bind(this),
    },
  };

  ngOnInit(): void {
    this.vm$ = this.ordersFacade.getViewModel();
    this.initializeUrl();
    this.setupErrorHandling();

    this.modalService.syncWithUrl(this.modalConfigs);
  }

  setFilter(filter: Filter): void {
    this.updateUrlWithFilter(filter);
  }

  clearFilter() {
    this.setUrlToDefaults();
  }

  showOrderDetails(orderId: string): void {
    this.modalService.showModalWithUrl(this.orderDetailsDialog.bind(this), orderId, 'orderId');
  }

  showOrderInvoice(orderId: string): void {
    this.modalService.showModalWithUrl(this.orderInvoiceDialog.bind(this), orderId, 'invoiceId');
  }

  onSortChange(sort: SortConfig): void {
    // Обновляем состояние
    // this.store.dispatch(OrdersActions.setSort({ sort }));

    // Обновляем URL
    const sortParams: Partial<QueryParams> = {
      [FILTER_QUERY_PARAMS.PAGE]: DEFAULT_PAGE,
    };

    if (sort.field && sort.direction !== 0) {
      sortParams[FILTER_QUERY_PARAMS.SORT_FIELD] = sort.field;
      sortParams[FILTER_QUERY_PARAMS.SORT_DIRECTION] = sortDirectionToString(sort.direction);
    } else {
      this.clearSortFromUrl();
      return;
    }

    this.updateUrl(sortParams);
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

  private clearSortFromUrl(): void {
    const currentParams = { ...this.route.snapshot.queryParams };
    delete currentParams[FILTER_QUERY_PARAMS.SORT_FIELD];
    delete currentParams[FILTER_QUERY_PARAMS.SORT_DIRECTION];
    currentParams[FILTER_QUERY_PARAMS.PAGE] = DEFAULT_PAGE;

    this.router.navigate([], {
      queryParams: currentParams,
      replaceUrl: false,
    });
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
          this.modalService.closeAllModals();
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
