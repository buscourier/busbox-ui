import { Injectable } from '@angular/core';
import { catchError, type Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@core/services';

import { environment } from '@env/environment';

import type {
  CancelOrderPayload,
  CancelOrderResponse,
  OrderDetails,
  OrderListPayload,
  OrderListResponse,
} from '../types';

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends ApiService {
  private cache = new Map<string, Observable<OrderListResponse>>();

  // getOrderList(payload: OrderListPayload): Observable<OrderListResponse> {
  //   const cacheKey = JSON.stringify(payload);
  //
  //   if (this.cache.has(cacheKey)) {
  //     return this.cache.get(cacheKey)!;
  //   }
  //
  //   const request$ = this.http
  //     .post<OrderListResponse>(
  //       `${this.baseUrl}/order/getorders/`,
  //       JSON.stringify({
  //         'api-key': environment.apiKey,
  //         ...payload,
  //       }),
  //     )
  //     .pipe(
  //       map((response) => {
  //         if (!response || !Array.isArray(response.orders)) {
  //           return {
  //             rows: '0',
  //             orders: [],
  //           };
  //         }
  //
  //         return response;
  //       }),
  //       catchError((error) => {
  //         this.cache.delete(cacheKey);
  //         return this.handleError(error);
  //       }),
  //       shareReplay({
  //         bufferSize: 1,
  //         refCount: true,
  //       }),
  //     );
  //
  //   this.cache.set(cacheKey, request$);
  //   return request$;
  // }

  getOrderList(payload: OrderListPayload): Observable<OrderListResponse> {
    return this.http
      .post<OrderListResponse>(
        `${this.baseUrl}/order/getorders/`,
        JSON.stringify({
          'api-key': environment.apiKey,
          ...payload,
        }),
      )
      .pipe(
        map((response) => {
          if (!response || !Array.isArray(response.orders)) {
            return {
              rows: '0',
              orders: [],
            };
          }

          return response;
        }),
        catchError((error) => {
          return this.handleError(error);
        }),
      );
  }

  clearCache(): void {
    this.cache.clear();
  }

  getOrder(orderId: string): Observable<OrderDetails> {
    return this.http
      .get<OrderDetails>(`${this.baseUrl}/order/getdetails/${environment.apiKey}/${orderId}`)
      .pipe(
        // tap((response) => {
        //   if (!response || !response.order) {
        //     throw new Error('Детали заказа не найдены');
        //   }
        // }),
        catchError(this.handleError.bind(this)),
      );
  }

  cancelOrder(payload: CancelOrderPayload): Observable<CancelOrderResponse> {
    return this.http
      .post<CancelOrderResponse>(
        `${this.baseUrl}/order/ordercancel`,
        JSON.stringify({
          'api-key': environment.apiKey,
          ...payload,
        }),
      )
      .pipe(
        tap(() => this.clearCache()),
        catchError(this.handleError.bind(this)),
      );
  }
}
