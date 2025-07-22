import { Injectable } from '@angular/core';
import { catchError, forkJoin, retry } from 'rxjs';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@core/services';

import type { Cargo, DeliveryOptions, Service } from '@delivery/delivery-details/types';

const MAX_RETRIES = 3;

@Injectable({
  providedIn: 'root',
})
export class DeliveryService extends ApiService {
  loadCargos(pickupCityId: string, deliveryCityId: string): Observable<Cargo[]> {
    return this.http
      .get<Cargo[]>(`${this.baseUrl}/calc/gettypes/${pickupCityId}/${deliveryCityId}`)
      .pipe(retry(MAX_RETRIES), catchError(this.handleError.bind(this)));
  }

  loadServices(pickupCityId: string, deliveryCityId: string): Observable<Service[]> {
    return this.http
      .get<Service[]>(`${this.baseUrl}/calc/getservices/${pickupCityId}/${deliveryCityId}`)
      .pipe(retry(MAX_RETRIES), catchError(this.handleError.bind(this)));
  }

  loadOptions(pickupCityId: string, deliveryCityId: string): Observable<DeliveryOptions> {
    return forkJoin([
      this.loadCargos(pickupCityId, deliveryCityId),
      this.loadServices(pickupCityId, deliveryCityId),
    ]).pipe(
      map(([cargos, services]: [Cargo[], Service[]]) => ({
        cargos,
        services,
      })),
      catchError(this.handleError.bind(this)),
    );
  }
}
