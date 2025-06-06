import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import type { DeliveryCity, LocationsErrorStatus, Office, PickupCity } from '@shared/types';

import { LocationsActions } from './actions';
import { locationsFeature } from './feature';

@Injectable({
  providedIn: 'root',
})
export class LocationsFacade {
  private readonly store = inject(Store);

  // === SELECTORS (READ) ===
  getPickupCities(): Observable<PickupCity[]> {
    return this.store.select(locationsFeature.selectPickupCities);
  }

  getDeliveryCities(): Observable<DeliveryCity[]> {
    return this.store.select(locationsFeature.selectDeliveryCities);
  }

  getPickupCityById(id: string): Observable<PickupCity | null> {
    return this.store.select(locationsFeature.selectPickupCityById(id));
  }

  getOffices(): Observable<Office[]> {
    return this.store.select(locationsFeature.selectOffices);
  }

  getErrorStatus(): Observable<LocationsErrorStatus> {
    return this.store.select(locationsFeature.selectErrorStatus);
  }

  // === STATUS SELECTORS ===
  isPickupCitiesLoading(): Observable<boolean> {
    return this.store.select(locationsFeature.selectIsPickupCitiesLoading);
  }

  isPickupCitiesLoaded(): Observable<boolean> {
    return this.store.select(locationsFeature.selectIsPickupCitiesLoaded);
  }

  isDeliveryCitiesLoading(): Observable<boolean> {
    return this.store.select(locationsFeature.selectIsDeliveryCitiesLoading);
  }

  isOfficesLoading(): Observable<boolean> {
    return this.store.select(locationsFeature.selectIsOfficesLoading);
  }

  isOfficesLoaded(): Observable<boolean> {
    return this.store.select(locationsFeature.selectIsOfficesLoaded);
  }

  // === ACTIONS (WRITE) ===
  loadPickupCities(): void {
    this.store.dispatch(LocationsActions.loadPickupCities());
  }

  loadDeliveryCities(pickupCityId: string): void {
    this.store.dispatch(LocationsActions.loadDeliveryCities({ pickupCityId }));
  }

  loadOffices(): void {
    this.store.dispatch(LocationsActions.loadOffices());
  }

  clearDeliveryCities(): void {
    this.store.dispatch(LocationsActions.clearDeliveryCities());
  }

  clearAllCache(): void {
    this.store.dispatch(LocationsActions.clearAllCache());
  }
}
