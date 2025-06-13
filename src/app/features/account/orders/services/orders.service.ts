import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, type Observable, shareReplay } from 'rxjs';

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
  constructor(http: HttpClient) {
    super(http);
  }

  getOrderList(payload: OrderListPayload): Observable<OrderListResponse> {
    return this.http
      .post<OrderListResponse>(
        `${this.baseUrl}/order/getorders/`,
        JSON.stringify({
          'api-key': environment.apiKey,
          ...payload,
        }),
      )
      .pipe(catchError(this.handleError.bind(this)), shareReplay(1));
  }

  getOrder(orderId: string): Observable<OrderDetails> {
    return this.http
      .get<OrderDetails>(`${this.baseUrl}/order/getdetails/${environment.apiKey}/${orderId}`)
      .pipe(catchError(this.handleError.bind(this)));
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
      .pipe(catchError(this.handleError.bind(this)));
  }
}
