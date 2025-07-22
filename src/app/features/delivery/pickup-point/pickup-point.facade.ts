import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import type { FormControlStatus, FormValidationState, Office, PickupCity } from '@shared/types';

import type { Courier, CourierDetails, ReviewSection } from '@delivery/types';

import { PickupPointActions, pickupPointFeature } from './store';
import type { PickupPointViewModel, PickupPointTabType } from './types';

@Injectable({
  providedIn: 'root',
})
export class PickupPointFacade {
  private readonly store = inject(Store);

  init(): void {
    this.store.dispatch(PickupPointActions.initState());
  }

  /**
   * Загружает список городов отправления
   */
  loadCities(): void {
    this.store.dispatch(PickupPointActions.loadCities());
  }

  getViewModel(): Observable<PickupPointViewModel> {
    return this.store.select(pickupPointFeature.selectViewModel);
  }

  getSelectedCity(): Observable<PickupCity | null> {
    return this.store.select(pickupPointFeature.selectSelectedCity);
  }

  getSelectedOffice(): Observable<Office | null> {
    return this.store.select(pickupPointFeature.selectSelectedOffice);
  }

  /**
   * Получает детали курьера (если выбран)
   */
  getCourier(): Observable<Courier | null> {
    return this.store.select(pickupPointFeature.selectCourier);
  }

  getDepartureDate(): Observable<string | null> {
    return this.store.select(pickupPointFeature.selectDepartureDate);
  }

  getFormState(): Observable<FormValidationState> {
    return this.store.select(pickupPointFeature.selectFormState);
  }

  /**
   * Проверяет, является ли форма валидной
   */
  // isFormValid(): Observable<boolean> {
  //   return this.store
  //     .select(pickupPointFeature.selectFormState)
  //     .pipe(map((formState) => formState.status === FormControlStatus.VALID));
  // }

  getAvailableOffices(): Observable<Office[]> {
    return this.store.select(pickupPointFeature.selectAvailableOffices);
  }

  /**
   * Получает текущий активный таб
   */
  getPickupTypeName(): Observable<string> {
    return this.store.select(pickupPointFeature.selectActiveTabName);
  }

  /**
   * Получает список всех табов
   */
  getTabs(): Observable<unknown[]> {
    return this.store.select(pickupPointFeature.selectTabs);
  }

  selectCity(city: PickupCity): unknown {
    return this.store.dispatch(PickupPointActions.selectCity({ city }));
  }

  selectOffice(office: Office): void {
    this.store.dispatch(PickupPointActions.selectOffice({ office }));
  }

  isOfficeLimited(): Observable<boolean> {
    return this.store.select(pickupPointFeature.selectIsOfficeLimited);
  }

  updateCourierDetails(courierDetails: CourierDetails): void {
    this.store.dispatch(PickupPointActions.updateCourierDetails({ courierDetails }));
  }

  isCourierSelected(): Observable<boolean> {
    return this.store.select(pickupPointFeature.selectIsCourierSelected);
  }

  setDepartureDate(departureDate: string): void {
    this.store.dispatch(PickupPointActions.setDepartureDate({ departureDate }));
  }

  setActiveTab(activeTabId: PickupPointTabType): void {
    this.store.dispatch(PickupPointActions.setActiveTabId({ activeTabId }));
  }

  setFormState(
    status: FormControlStatus,
    pristine: boolean,
    touched: boolean,
    dirty: boolean,
  ): void {
    this.store.dispatch(
      PickupPointActions.setFormState({
        status,
        pristine,
        touched,
        dirty,
      }),
    );
  }

  reset(keepCity = false, city?: PickupCity): void {
    this.store.dispatch(PickupPointActions.resetState({ keepCity, city }));
  }

  resetOffice(): void {
    this.store.dispatch(PickupPointActions.resetOffice());
  }

  resetCourierDetails(): void {
    this.store.dispatch(PickupPointActions.resetCourierDetails());
  }

  getReviewSection(): Observable<ReviewSection> {
    return this.store.select(pickupPointFeature.selectReviewSection);
  }
}
