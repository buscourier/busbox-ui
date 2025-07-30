import { Injectable } from '@angular/core';
import { catchError, type Observable, shareReplay } from 'rxjs';

import { ApiService } from '@core/services';

export interface City {
  name: string;
  descr: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourierService extends ApiService {
  cachedCities$: Observable<City[]> | null = null;

  private readonly courierUrl = `${this.baseUrl}/site/kuriertariffs/list`;

  getCities(): Observable<City[]> {
    if (!this.cachedCities$) {
      this.cachedCities$ = this.http
        .get<City[]>(this.courierUrl)
        .pipe(catchError(this.handleError.bind(this)), shareReplay(1));
    }

    return this.cachedCities$;
  }
}
