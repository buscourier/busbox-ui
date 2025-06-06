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
import type { FilterState } from './store';
import type { OrdersViewModel, Filter, UrlParams } from './types';

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
    this.ensureUrlParams();
  }

  applyFilter(filter: Filter): void {
    this.updateUrlWithFilter(filter);
    // this.ordersFacade.applyFilter(filter);
  }

  clearFilter() {
    this.resetUrlToDefaults();
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

    this.updateUrlParams({
      [FILTER_QUERY_PARAMS.PAGE]: DEFAULT_PAGE,
      [FILTER_QUERY_PARAMS.PAGE_SIZE]: validatedPageSize,
    });
  }

  navigateToPage(page: number): void {
    this.updateUrlParams({ [FILTER_QUERY_PARAMS.PAGE]: page });
    // this.ordersFacade.loadPage(page);
  }

  private resetUrlToDefaults(): void {
    const defaultParams: Partial<UrlParams> = {
      page: DEFAULT_PAGE,
      size: DEFAULT_PAGE_SIZE,
    };

    this.router.navigate([], {
      queryParams: defaultParams,
      replaceUrl: true,
    });
  }

  private ensureUrlParams(): void {
    const queryParams = this.route.snapshot.queryParams;

    if (Object.keys(queryParams).length === 0) {
      this.router.navigate([], {
        queryParams: { page: DEFAULT_PAGE, size: DEFAULT_PAGE_SIZE },
        replaceUrl: true,
      });
    }
  }

  private updateUrlWithFilter(filter: FilterState): void {
    const queryParams: Record<string, string | number> = {
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

    this.updateUrlParams(queryParams);
  }

  private updateUrlParams(params: Record<string, string | number>): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: false,
    });
  }
}
