import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, type Observable, take } from 'rxjs';

import { ExcelService } from '@core/services';

import { OrdersActions, ordersFeature } from './store';
import type { OrdersViewModel, Order } from './types';

@Injectable({
  providedIn: 'root',
})
export class OrdersFacade {
  private readonly store = inject(Store);
  private excelService = inject(ExcelService);

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

  // loadPage(page: number): void {
  //   this.store.dispatch(OrdersActions.setCurrentPage({ page }));
  // }

  loadOrder(orderId: string): void {
    this.store.dispatch(OrdersActions.getOrder({ orderId }));
  }

  // setPageSize(pageSize: number): void {
  //   this.store.dispatch(OrdersActions.setPageSize({ pageSize }));
  // }
  //
  // getPageSize(): Observable<number> {
  //   return this.store.select(ordersFeature.selectPageSize);
  // }
  //
  // setFilter(filter: Filter): void {
  //   this.store.dispatch(
  //     OrdersActions.setFilter({
  //       filter,
  //     }),
  //   );
  // }
  //
  // clearFilter(): void {
  //   this.store.dispatch(OrdersActions.clearFilter());
  // }
  //
  // getFilter(): Observable<Filter> {
  //   return this.store.select(ordersFeature.selectFilter);
  // }

  exportOrdersToExcel(): void {
    this.store
      .select(ordersFeature.selectOrderList)
      .pipe(
        take(1),
        filter((orders) => orders.length > 0),
      )
      .subscribe((orders) => {
        const columns = [
          { key: 'order_id' as keyof Order, header: 'ID заказа', width: 15 },
          { key: 'date' as keyof Order, header: 'Дата', width: 12 },
          { key: 'sender_name' as keyof Order, header: 'Отправитель', width: 20 },
          { key: 'recipient_name' as keyof Order, header: 'Получатель', width: 20 },
          { key: 'start_city' as keyof Order, header: 'Город отправления', width: 18 },
          { key: 'end_city' as keyof Order, header: 'Город получения', width: 18 },
          { key: 'order_rice' as keyof Order, header: 'Стоимость', width: 12 },
          { key: 'status' as keyof Order, header: 'Статус', width: 15 },
        ];

        this.excelService.exportToExcel(orders, 'orders_export', 'Заказы', columns);
      });
  }
}
