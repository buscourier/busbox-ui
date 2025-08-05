import { Injectable } from '@angular/core';
import { catchError, type Observable, shareReplay } from 'rxjs';

import { ApiService } from '@core/services/api.service';

export interface CompanyStats {
  orders_sent: string;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyStatsService extends ApiService {
  cachedStats$: Observable<CompanyStats> | null = null;

  private readonly courierUrl = `${this.baseUrl}/site/orders_sent`;

  getStats(): Observable<CompanyStats> {
    if (!this.cachedStats$) {
      this.cachedStats$ = this.http
        .get<CompanyStats>(this.courierUrl)
        .pipe(catchError(this.handleError.bind(this)), shareReplay(1));
    }

    return this.cachedStats$;
  }
}
