import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tuiDialog } from '@taiga-ui/core';
import { type Observable } from 'rxjs';

import { FilterComponent } from './components/filter';
import { OrderDetailsComponent } from './components/order-details';
import { OrderListComponent } from './components/order-list';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from './constants';
import { OrdersFacade } from './orders.facade';
import type { OrdersViewModel, Filter, QueryParams } from './types';

const FILTER_QUERY_PARAMS = {
  PAGE: 'page',
  PICKUP_CITY: 'from',
  DELIVERY_CITY: 'to',
  DATE_RANGE: 'range',
  PAGE_SIZE: 'size',
} as const;

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe, FilterComponent, OrderListComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent implements OnInit {
  vm$!: Observable<OrdersViewModel>;

  dialog = tuiDialog(OrderDetailsComponent, {
    closeable: true,
    dismissible: true,
    size: 's',
  });

  private readonly ordersFacade = inject(OrdersFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.vm$ = this.ordersFacade.getViewModel();
    this.initializeUrl();
  }

  setFilter(filter: Filter): void {
    this.updateUrlWithFilter(filter);
    // this.ordersFacade.setFilter(filter);
  }

  clearFilter() {
    this.setUrlToDefaults();
  }

  showOrderDetails(orderId: string): void {
    this.dialog(orderId).subscribe({
      next: () => {
        console.log('next');
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
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
    // this.ordersFacade.loadPage(page);
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
}
