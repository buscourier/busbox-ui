import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tuiDialog } from '@taiga-ui/core';
import { type Observable } from 'rxjs';

import { type ModalConfig, ModalService } from '@core/services/modal.service';

import { BalanceComponent } from '@account/balance';

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
  imports: [AsyncPipe, FilterComponent, OrderListComponent, BalanceComponent],
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
  private readonly modalService = inject(ModalService);

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
    // this.store.dispatch(OrdersActions.setSort({ sort }));

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
    this.ordersFacade.exportToExcel();
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
}
