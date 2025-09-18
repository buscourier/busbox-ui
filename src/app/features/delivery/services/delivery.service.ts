import { Injectable } from '@angular/core';
import { catchError, forkJoin, retry } from 'rxjs';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@core/services';

import type {
  AutoPartPreset,
  AutoPartPresetResponse,
  Cargo,
  DeliveryOptions,
  Service,
} from '@delivery/delivery-details/types';

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
      this.loadAutoPartPresets(),
    ]).pipe(
      map(([cargos, services, autoPartPresets]: [Cargo[], Service[], AutoPartPreset[]]) => ({
        cargos,
        services,
        autoPartPresets,
      })),
      catchError(this.handleError.bind(this)),
    );
  }

  loadAutoPartPresets(): Observable<AutoPartPreset[]> {
    return this.http.get<AutoPartPresetResponse[]>(`${this.baseUrl}/calc/getpresets`).pipe(
      map((presets) =>
        presets.map((preset) => ({
          ...preset,
          width: parseInt(preset.width, 10),
          height: parseInt(preset.width, 10),
          length: parseInt(preset.width, 10),
          weight: parseInt(preset.width, 10),
        })),
      ),
      retry(MAX_RETRIES),
      catchError(this.handleError.bind(this)),
    );
  }

  // private generateId(preset: AutoPartPreset): string {
  //   return preset.name
  //     .toLowerCase()
  //     .replace(/\s+/g, '-')
  //     .replace(/[^a-z0-9-]/g, '');
  // }
}
