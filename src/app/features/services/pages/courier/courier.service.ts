import { Injectable } from '@angular/core';
import { catchError, type Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@core/services';

export interface City {
  name: string;
  descr: string;
}

export interface GroupedCities {
  pickupAndDelivery: City[];
  deliveryOnly: City[];
}

@Injectable({
  providedIn: 'root',
})
export class CourierService extends ApiService {
  cachedCities$: Observable<GroupedCities> | null = null;

  private readonly courierUrl = `${this.baseUrl}/site/kuriertariffs/list`;

  getCities(): Observable<GroupedCities> {
    if (!this.cachedCities$) {
      this.cachedCities$ = this.http.get<City[]>(this.courierUrl).pipe(
        map((cities) => this.groupCitiesByService(cities)),
        catchError(this.handleError.bind(this)),
        shareReplay(1),
      );
    }

    return this.cachedCities$;
  }

  private groupCitiesByService(cities: City[]): GroupedCities {
    const groups = cities.reduce(
      (acc, city) => {
        const description = city.descr.toLowerCase();

        if (description.includes('забор и доставка')) {
          acc.pickupAndDelivery.push(city);
        } else if (
          description.includes('только доставка') ||
          description.match(/\(только доставка.*\)/)
        ) {
          acc.deliveryOnly.push(city);
        } else {
          console.warn(`Unknown service type for city: ${city.name} - ${city.descr}`);
          acc.deliveryOnly.push(city);
        }

        return acc;
      },
      {
        pickupAndDelivery: [] as City[],
        deliveryOnly: [] as City[],
      },
    );

    return {
      pickupAndDelivery: this.sortCitiesAlphabetically(groups.pickupAndDelivery),
      deliveryOnly: this.sortCitiesAlphabetically(groups.deliveryOnly),
    };
  }

  private sortCitiesAlphabetically(cities: City[]): City[] {
    return cities.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }
}
