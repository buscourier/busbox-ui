import type { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, concatAll, filter, shareReplay, throwError, toArray } from 'rxjs';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ERROR_MESSAGES, type ErrorCode } from '@core/constants';

import type { DeliveryCity, Office, PickupCity } from '@shared/types';

import { environment } from '@env/environment';

const EXCLUDED_CITY_ID = '249';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly url = `${environment.apiBaseUrl}`;
  private cachedStartCities$: Observable<PickupCity[]> | null = null;
  private cachedOffices$: Observable<Office[]> | null = null;

  protected readonly http = inject(HttpClient);

  protected get baseUrl(): string {
    return this.url;
  }

  getPickupCities({ sorted = true } = {}): Observable<PickupCity[]> {
    if (!this.cachedStartCities$) {
      this.cachedStartCities$ = this.http.get<PickupCity[]>(`${this.url}/calc/getcitiesfrom`).pipe(
        concatAll(),
        filter((city) => city.id !== EXCLUDED_CITY_ID),
        map((city) => this.cleanCityName(city)),
        toArray(),
        map((cities) => (sorted ? this.sortCitiesByName<PickupCity>(cities) : cities)),
        catchError(this.handleError.bind(this)),
        shareReplay(1),
      );
    }

    return this.cachedStartCities$;
  }

  getDeliveryCities(PickupCityId: string): Observable<DeliveryCity[]> {
    return this.http.get<DeliveryCity[]>(`${this.url}/calc/getcitiesto/${PickupCityId}/0`).pipe(
      map((cities) => this.sortCitiesByName<DeliveryCity>(cities)),
      catchError(this.handleError.bind(this)),
      // shareReplay(1),
    );
  }

  getOffices(): Observable<Office[]> {
    if (!this.cachedOffices$) {
      const url = `${this.url}/calc/getoffices`;

      this.cachedOffices$ = this.http
        .get<Office[]>(url)
        .pipe(map(this.transformOffices), catchError(this.handleError.bind(this)), shareReplay(1));
    }

    return this.cachedOffices$;
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      error.status in ERROR_MESSAGES
        ? ERROR_MESSAGES[error.status as ErrorCode]
        : `Произошла неизвестная ошибка ${error.message}`;

    console.error('Ошибка HTTP запроса:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error,
    });
    console.error('Сообщение об ошибке:', errorMessage);

    return throwError(() => new Error(errorMessage));
  }

  private transformOffices(offices: Office[]): Office[] {
    return offices.map((office) => ({
      ...office,
      geo_x: Number(office.geo_x) || 0,
      geo_y: Number(office.geo_y) || 0,
      lat: Number(office.geo_x) || 0,
      lng: Number(office.geo_y) || 0,
    }));
  }

  private cleanCityName(city: PickupCity): PickupCity {
    return {
      ...city,
      name: city.name.includes('(') ? city.name.split('(')[0].trim() : city.name,
    };
  }

  private sortCitiesByName<T extends { name: string }>(cities: T[]): T[] {
    return cities.sort((a, b) => a.name.localeCompare(b.name));
  }
}
