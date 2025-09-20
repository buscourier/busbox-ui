import { Injectable, type Signal, signal } from '@angular/core';

import type { DeliveryCity } from '@shared/types';

import { PARCEL_ITEM_LIMITS, PARCELS_LIMITS, RESTRICTION_MESSAGES } from '../constants';
import type {
  CargoItemRestrictions,
  CargoPointRestriction,
  GetCargoRestrictionsParams,
  GetParcelItemLimitsParams,
  ParcelItemLimits,
  ParcelsLimits,
} from '../types';

@Injectable({
  providedIn: 'root',
})
export class CargoRestrictionsService {
  private readonly cityParcelsLimits = new Map<string, ParcelsLimits>();
  private readonly cityParcelItemLimits = new Map<string, ParcelItemLimits>();

  private readonly _parcelsLimits = signal<ParcelsLimits>({ ...PARCELS_LIMITS.DEFAULT });
  private readonly _parcelItemLimits = signal<ParcelItemLimits>({ ...PARCEL_ITEM_LIMITS.DEFAULT });
  private readonly _cargoLimits = signal<CargoItemRestrictions>({
    pickupOffice: null,
    deliveryOffice: null,
    pickupCourier: null,
    deliveryCourier: null,
  });

  readonly parcelsLimits: Signal<ParcelsLimits> = this._parcelsLimits.asReadonly();
  readonly parcelItemLimits: Signal<ParcelItemLimits> = this._parcelItemLimits.asReadonly();
  readonly cargoLimits: Signal<CargoItemRestrictions> = this._cargoLimits.asReadonly();

  constructor() {
    this.cityParcelsLimits = this.initCityParcelsLimits();
    this.cityParcelItemLimits = this.initCityParcelItemLimits();
  }

  setRestrictions(params: GetCargoRestrictionsParams): void {
    const isOfficeLimited = params.isPickupOfficeLimited || params.isDeliveryOfficeLimited;
    const isCourierLimited = params.isPickupCourierSelected || params.isDeliveryCourierSelected;

    this._parcelsLimits.set(
      this.getParcelsLimits({
        deliveryCity: params.deliveryCity,
        isOfficeLimited,
        isCourierLimited,
      }),
    );

    this._parcelItemLimits.set(
      this.getParcelItemLimits({
        deliveryCity: params.deliveryCity,
        isOfficeLimited,
        isCourierLimited,
      }),
    );

    this._cargoLimits.set(this.getCargoItemRestrictions(params));
  }

  private getParcelsLimits({
    deliveryCity,
    isOfficeLimited,
    isCourierLimited,
  }: GetParcelItemLimitsParams): ParcelsLimits {
    const cityParcelItemLimits = this.getCityParcelsLimits(deliveryCity);
    if (cityParcelItemLimits) return cityParcelItemLimits;

    if (isOfficeLimited) {
      return { ...PARCELS_LIMITS.OFFICE };
    }

    if (isCourierLimited) {
      return { ...PARCELS_LIMITS.COURIER };
    }

    return { ...PARCELS_LIMITS.DEFAULT };
  }

  private getParcelItemLimits({
    deliveryCity,
    isOfficeLimited,
    isCourierLimited,
  }: GetParcelItemLimitsParams): ParcelItemLimits {
    const limitsByCity = this.getCityParcelItemLimits(deliveryCity);
    if (limitsByCity) return limitsByCity;

    if (isOfficeLimited) {
      return { ...PARCEL_ITEM_LIMITS.OFFICE };
    }

    if (isCourierLimited) {
      return { ...PARCEL_ITEM_LIMITS.COURIER };
    }

    return { ...PARCEL_ITEM_LIMITS.DEFAULT };
  }

  private initCityParcelsLimits(): Map<string, ParcelsLimits> {
    const map = new Map<string, ParcelsLimits>();

    PARCELS_LIMITS.CITY.forEach((limit, ids) => {
      ids.forEach((id) => {
        map.set(id, limit);
      });
    });

    return map;
  }

  private initCityParcelItemLimits(): Map<string, ParcelItemLimits> {
    const map = new Map<string, ParcelItemLimits>();

    PARCEL_ITEM_LIMITS.CITY.forEach((limit, ids) => {
      ids.forEach((id) => {
        map.set(id, limit);
      });
    });

    return map;
  }

  private getCityParcelItemLimits(city: DeliveryCity | null): ParcelItemLimits | null {
    if (!city) return null;

    const limits = this.cityParcelItemLimits.get(city.id);
    if (!limits) return null;

    return limits;
  }

  private getCityParcelsLimits(city: DeliveryCity | null): ParcelsLimits | null {
    if (!city) return null;

    const limits = this.cityParcelsLimits.get(city.id);
    if (!limits) return null;

    return limits;
  }

  getCargoItemRestrictions(params: GetCargoRestrictionsParams): CargoItemRestrictions {
    return {
      pickupOffice: params.isPickupOfficeLimited
        ? this.createCargoPointRestriction(RESTRICTION_MESSAGES.START_OFFICE)
        : null,
      deliveryOffice: params.isDeliveryOfficeLimited
        ? this.createCargoPointRestriction(RESTRICTION_MESSAGES.END_OFFICE)
        : null,
      pickupCourier: params.isPickupCourierSelected
        ? this.createCargoPointRestriction(RESTRICTION_MESSAGES.START_COURIER)
        : null,
      deliveryCourier: params.isDeliveryCourierSelected
        ? this.createCargoPointRestriction(RESTRICTION_MESSAGES.END_COURIER)
        : null,
    };
  }

  createCargoPointRestriction(message: string): CargoPointRestriction {
    return {
      restricted: true,
      message,
    };
  }
}
