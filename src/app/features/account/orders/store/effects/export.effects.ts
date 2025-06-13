import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, first, switchMap, tap, withLatestFrom } from 'rxjs';

import { ExcelService, type ExportOptions } from '@core/services';

import type { ApiError } from '@shared/types';

import { AuthFacade } from '@auth';

import { EXPORT_COLUMNS } from '../../constants';
import { OrdersService } from '../../services/orders.service';
import type { OrderListPayload } from '../../types';

import { OrdersActions } from '../actions';
import { ordersFeature } from '../feature';

export const exportEffects = {
  exportToExcel: createEffect(
    (
      actions$ = inject(Actions),
      authFacade = inject(AuthFacade),
      ordersService = inject(OrdersService),
      store = inject(Store),
    ) => {
      return actions$.pipe(
        ofType(OrdersActions.exportToExcel),
        switchMap(() =>
          authFacade.getCurrentUser().pipe(
            filter((user) => !!user),
            first(),
            withLatestFrom(store.select(ordersFeature.selectFilter)),
            switchMap(([user, filter]) => {
              const payload: OrderListPayload = {
                'user-id': user.id,
                'page-num': '1',
                'elements-on-page': '9999',
                ...(filter.range && {
                  'start-date': filter.range.split(',')[0],
                  'end-date': filter.range.split(',')[1],
                }),
                ...(filter.pickupCity && { 'start-city': filter.pickupCity.id }),
                ...(filter.deliveryCity && { 'end-city': filter.deliveryCity.id }),
              };

              return ordersService.getOrderList(payload).pipe(
                mapResponse({
                  next: (response) => OrdersActions.exportToExcelSuccess({ response }),
                  error: (error: ApiError) => OrdersActions.exportToExcelFailure({ error }),
                }),
              );
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),

  exportAfterLoad: createEffect(
    (actions$ = inject(Actions), excelService = inject(ExcelService), store = inject(Store)) => {
      return actions$.pipe(
        ofType(OrdersActions.exportToExcelSuccess),
        withLatestFrom(store.select(ordersFeature.selectFilter)),
        tap(([{ response }, filter]) => {
          const orders = response.orders;

          if (!orders || orders.length === 0) {
            console.warn('No orders to export');
            return;
          }

          try {
            const exportOptions: ExportOptions = {
              title: 'Отчет по заказам',
              subtitle: `Экспорт данных от ${new Date().toLocaleDateString('ru-RU')}`,
              metadata: {
                'Всего заказов:': orders.length,
                'Период:': filter.range || 'Все время',
                'Город отправления:': filter.pickupCity?.name || 'Все города',
                'Город получения:': filter.deliveryCity?.name || 'Все города',
                'Дата экспорта:': new Date().toLocaleString('ru-RU'),
              },
              showSummary: true,
              footerText: 'Сгенерировано автоматически системой управления заказами',
            };

            excelService.exportToExcel(
              orders,
              'orders_export',
              'Заказы',
              EXPORT_COLUMNS,
              exportOptions, // ✅ Передаем опции
            );
          } catch (error) {
            console.error('Export error:', error);
          }
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
