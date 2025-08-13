import { Injectable } from '@angular/core';
import { catchError, type Observable, retry } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@core/services';

import { environment } from '@env/environment';

export enum OrderStatusCode {
  ORDER_POSTING = 'ORDER_POSTING',
  ORDER_INTRANSIT = 'ORDER_INTRANSIT',
  ORDER_SORTING = 'ORDER_SORTING',
  ORDER_READY = 'ORDER_READY',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_SELFEXTRACT = 'ORDER_SELFEXTRACT',
  ORDER_RETURN = 'ORDER_RETURN',
  ORDER_FAILURE = 'ORDER_FAILURE',
  ORDER_STORAGE = 'ORDER_STORAGE',
  ORDER_RESENT = 'ORDER_RESENT',
  ORDER_CANCELED = 'ORDER_CANCELED',
}

export interface OrderStatus {
  serverdate: string;
  unixtime: string; // лучше number?
  name: string;
  lk_name: string;
  charcode: OrderStatusCode; // строгая типизация!
}

@Injectable({
  providedIn: 'root',
})
export class OrderTrackingService extends ApiService {
  private readonly trackingUrl = `${this.baseUrl}/order/gettracking/${environment.apiKey}`;

  getStatusList(orderNumber: string): Observable<OrderStatus[]> {
    return this.http.get<OrderStatus[] | string>(`${this.trackingUrl}/${orderNumber}`).pipe(
      map((result) => {
        if (typeof result === 'string' && result.includes('No orders found')) {
          return [];
        }
        return Array.isArray(result) ? result : [];
      }),
      catchError(this.handleError.bind(this)),
      retry(2),
    );
  }
}
