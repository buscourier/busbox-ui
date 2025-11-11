import { Injectable } from '@angular/core';
import { catchError, type Observable } from 'rxjs';

import { ApiService } from '@core/services';

import type { ShippingZone, ShippingZoneTariff } from '../types';

@Injectable({
  providedIn: 'root',
})
export class TariffsService extends ApiService {
  getZones(cityId: string): Observable<ShippingZone[]> {
    return this.http
      .get<ShippingZone[]>(`${this.baseUrl}/site/zones/${cityId}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getZoneTariffs(cityId: string): Observable<ShippingZoneTariff[]> {
    return this.http
      .get<ShippingZoneTariff[]>(`${this.baseUrl}/site/zonetariffs/${cityId}`)
      .pipe(catchError(this.handleError.bind(this)));
  }
}
