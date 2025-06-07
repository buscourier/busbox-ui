import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { type Observable } from 'rxjs';

import { OrdersActions, ordersFeature } from './store';
import type { OrdersViewModel, Filter } from './types';

@Injectable({
  providedIn: 'root',
})
export class OrdersFacade {
  private readonly store = inject(Store);

  getViewModel(): Observable<OrdersViewModel> {
    return this.store.select(ordersFeature.selectViewModel);
  }

  cancelOrder(): void {
    const payload = {
      'api-key': 'asdas',
      'user-id': '62',
      'order-id': '62',
    };

    this.store.dispatch(OrdersActions.cancelOrder({ payload }));
  }

  loadPage(page: number): void {
    this.store.dispatch(OrdersActions.setCurrentPage({ page }));
  }

  loadOrder(orderId: string): void {
    this.store.dispatch(OrdersActions.getOrder({ orderId }));
  }

  setPageSize(pageSize: number): void {
    this.store.dispatch(OrdersActions.setPageSize({ pageSize }));
  }

  getPageSize(): Observable<number> {
    return this.store.select(ordersFeature.selectPageSize);
  }

  setFilter(filter: Filter): void {
    this.store.dispatch(
      OrdersActions.setFilter({
        filter,
      }),
    );
  }

  clearFilter(): void {
    this.store.dispatch(OrdersActions.clearFilter());
  }

  getFilter(): Observable<Filter> {
    return this.store.select(ordersFeature.selectFilter);
  }
}
