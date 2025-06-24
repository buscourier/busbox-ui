import { Injectable } from '@angular/core';
import { catchError, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@core/services';

import { environment } from '@env/environment';

import type { BalanceApiResponse, BalanceSummary } from '../types';

@Injectable({
  providedIn: 'root',
})
export class BalanceService extends ApiService {
  getBalanceSummary(userId: string): Observable<BalanceSummary> {
    return this.http
      .get<BalanceApiResponse>(`${this.baseUrl}/account/balance/${environment.apiKey}/${userId}`)
      .pipe(
        map((response) => this.mapApiResponseToBalanceSummary(response)),
        catchError(this.handleError.bind(this)),
      );
  }

  private mapApiResponseToBalanceSummary(response: BalanceApiResponse): BalanceSummary {
    return {
      period: `${response.first_period_date} - ${response.last_period_date}`,
      debet: Number(response.debet),
      orderSum: Number(response.order_sum),
      serviceSum: Number(response.service_sum),
      total: this.calculateTotal(response),
    };
  }

  private calculateTotal(response: BalanceApiResponse): number {
    const debet = Number(response.debet);
    const orderSum = Number(response.order_sum);
    const serviceSum = Number(response.service_sum);
    return debet - (orderSum + serviceSum);
  }
}
