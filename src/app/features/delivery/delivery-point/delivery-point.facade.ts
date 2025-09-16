import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import type { DeliveryCity, FormControlStatus, FormValidationState, Office } from '@shared/types';

import type { Courier, CourierDetails, ReviewSection } from '@delivery/types';

import { DeliveryPointActions, deliveryPointFeature } from './store';
import type { DeliveryPointTabType, DeliveryPointViewModel } from './types';

@Injectable({
  providedIn: 'root',
})
export class DeliveryPointFacade {
  private readonly store = inject(Store);

  /**
   * Инициализирует модуль delivery-point
   */
  init(): void {
    this.store.dispatch(DeliveryPointActions.initState());
  }

  /**
   * Загружает список городов отправления
   */
  loadCities(startCityId: string): void {
    this.store.dispatch(DeliveryPointActions.loadCities({ startCityId }));
  }

  /**
   * Получает ViewModel для компонента
   */
  getViewModel(): Observable<DeliveryPointViewModel> {
    return this.store.select(deliveryPointFeature.selectViewModel);
  }

  /**
   * Получает выбранный город отправления
   */
  getSelectedCity(): Observable<DeliveryCity | null> {
    return this.store.select(deliveryPointFeature.selectSelectedCity);
  }

  /**
   * Получает выбранный офис отправления
   */
  getSelectedOffice(): Observable<Office | null> {
    return this.store.select(deliveryPointFeature.selectSelectedOffice);
  }

  /**
   * Получает детали курьера (если выбран)
   */
  getCourier(): Observable<Courier | null> {
    return this.store.select(deliveryPointFeature.selectCourier);
  }

  getFormState(): Observable<FormValidationState> {
    return this.store.select(deliveryPointFeature.selectFormState);
  }

  /**
   * Получает доступные офисы для выбранного города
   */
  getAvailableOffices(): Observable<Office[]> {
    return this.store.select(deliveryPointFeature.selectAvailableOffices);
  }

  /**
   * Получает текущий активный таб
   */
  getDeliveryTypeName(): Observable<string> {
    return this.store.select(deliveryPointFeature.selectActiveTabName);
  }

  /**
   * Получает список всех табов
   */
  getTabs(): Observable<unknown[]> {
    return this.store.select(deliveryPointFeature.selectTabs);
  }

  /**
   * Проверяет, загружаются ли в данный момент города
   */
  areCitiesLoading(): Observable<boolean> {
    return this.store.select(deliveryPointFeature.selectIsCitiesLoading);
  }

  // Команды (Actions)

  /**
   * Выбирает город отправления
   */
  selectCity(city: DeliveryCity): void {
    this.store.dispatch(DeliveryPointActions.selectCity({ city }));
  }

  /**
   * Выбирает офис отправления
   */
  selectOffice(office: Office): void {
    this.store.dispatch(DeliveryPointActions.selectOffice({ office }));
  }

  isOfficeLimited(): Observable<boolean> {
    return this.store.select(deliveryPointFeature.selectIsOfficeLimited);
  }

  /**
   * Обновляет информацию о курьере
   */
  updateCourierDetails(courierDetails: CourierDetails): void {
    this.store.dispatch(DeliveryPointActions.updateCourierDetails({ courierDetails }));
  }

  isCourierSelected(): Observable<boolean> {
    return this.store.select(deliveryPointFeature.selectIsCourierSelected);
  }

  /**
   * Изменяет активный таб
   */
  setActiveTab(activeTabId: DeliveryPointTabType): void {
    this.store.dispatch(DeliveryPointActions.setActiveTabId({ activeTabId }));
  }

  setBusPickup(enabled: boolean) {
    this.store.dispatch(DeliveryPointActions.setBusPickup({ enabled }));
  }

  getBusPickup(): Observable<boolean> {
    return this.store.select(deliveryPointFeature.selectBusPickup);
  }

  /**
   * Обновляет состояние формы
   */
  setFormState(
    status: FormControlStatus,
    pristine: boolean,
    touched: boolean,
    dirty: boolean,
  ): void {
    this.store.dispatch(
      DeliveryPointActions.setFormState({
        status,
        pristine,
        touched,
        dirty,
      }),
    );
  }

  /**
   * Сбрасывает состояние модуля
   */
  reset(keepCity = false, city?: DeliveryCity): void {
    this.store.dispatch(DeliveryPointActions.resetState({ keepCity, city }));
  }

  /**
   * Сбрасывает выбранный офис
   */
  resetOffice(): void {
    this.store.dispatch(DeliveryPointActions.resetOffice());
  }

  /**
   * Сбрасывает данные курьера
   */
  resetCourierDetails(): void {
    this.store.dispatch(DeliveryPointActions.resetCourierDetails());
  }

  // isFormValid(): Observable<boolean> {
  //   return this.store
  //     .select(deliveryPointFeature.selectFormState)
  //     .pipe(map((state) => state.valid));
  // }

  isFormValid(): Observable<boolean> {
    return this.store.select(deliveryPointFeature.selectIsFormValid);
  }

  // Вспомогательные методы

  /**
   * Проверяет, полностью ли заполнен модуль delivery-point
   */
  // isComplete(): Observable<boolean> {
  //   return this.getViewModel().pipe(
  //     map((vm) => {
  //       const hasCity = !!vm.cities.selected;
  //       const hasOffice = !!vm.offices.selected;
  //       const hasCourier = !!vm.courierDetails;
  //
  //       const isOfficeTabActive = vm.activeTab?.id === 'OFFICE';
  //       const isCourierTabActive = vm.activeTab?.id === 'COURIER';
  //
  //       if (isOfficeTabActive) {
  //         return hasCity && hasOffice;
  //       } else if (isCourierTabActive) {
  //         return hasCity && hasCourier;
  //       }
  //
  //       return false;
  //     }),
  //   );
  // }

  /**
   * Получает данные для сохранения в представлении обзора
   */
  getReviewSection(): Observable<ReviewSection> {
    return this.store.select(deliveryPointFeature.selectReviewSection);
  }

  isComplete(): Observable<boolean> {
    return this.store.select(deliveryPointFeature.selectIsDeliveryPointComplete);
  }

  isValid(): Observable<boolean> {
    return this.store.select(deliveryPointFeature.selectIsDeliveryPointValid);
  }
}
