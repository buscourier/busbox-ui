import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { ExcelService } from '@core/services';

import { OrdersActions, ordersFeature } from './store';
import type { OrdersViewModel } from './types';

@Injectable({
  providedIn: 'root',
})
export class OrdersFacade {
  private readonly store = inject(Store);
  private excelService = inject(ExcelService);

  getViewModel(): Observable<OrdersViewModel> {
    return this.store.select(ordersFeature.selectViewModel);
  }

  cancelOrder(orderId: string): void {
    this.store.dispatch(OrdersActions.cancelOrder({ orderId }));
  }

  loadOrderDetails(orderId: string): void {
    this.store.dispatch(OrdersActions.loadDetails({ orderId }));
  }

  exportToExcel(): void {
    this.store.dispatch(OrdersActions.exportList());
  }
}
