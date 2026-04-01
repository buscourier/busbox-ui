import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom, mapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { filter, switchMap, tap } from 'rxjs';

import { AuthFacade } from '@core/auth';
import { ExcelService, type ExportOptions } from '@core/services';

import type { ApiError } from '@shared/types';

import { EXPORT_COLUMNS } from '../../constants';
import { OrdersService } from '../../services/orders.service';
import type { OrderListPayload } from '../../types';

import { OrdersActions } from '../actions';
import { ordersFeature } from '../feature';

export const exportEffects = {
  exportList: createEffect(
    (
      actions$ = inject(Actions),
      auth = inject(AuthFacade),
      ordersService = inject(OrdersService),
      excelService = inject(ExcelService),
      store = inject(Store),
    ) => {
      return actions$.pipe(
        ofType(OrdersActions.exportList),
        concatLatestFrom(() => [auth.currentUser$, store.select(ordersFeature.selectFilter)]),
        filter(([, user]) => !!user),
        switchMap(([, user, filter]) => {
          const payload: OrderListPayload = {
            'user-id': user!.id,
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
            tap((response) => {
              const orders = response.orders;

              if (!orders || orders.length === 0) {
                console.warn('No orders to export');
                return;
              }

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
                exportOptions,
              );
            }),
            mapResponse({
              next: (response) => OrdersActions.exportListSuccess({ response }),
              error: (error: ApiError) => OrdersActions.exportListFailure({ error }),
            }),
          );
        }),
      );
    },
    { functional: true },
  ),
  afterSuccessExport: createEffect(
    (actions$ = inject(Actions), dialogs = inject(TuiResponsiveDialogService)) => {
      return actions$.pipe(
        ofType(OrdersActions.exportListSuccess),
        switchMap(({ response }) => {
          return dialogs.open(`Экспортировано: ${response.orders.length} заказа`, {
            label: 'Экспорт завершен!',
            size: 's',
            closeable: true,
            dismissible: true,
          });
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
