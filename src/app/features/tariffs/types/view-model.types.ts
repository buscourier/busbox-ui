import type { ShippingZone, ShippingZoneTariff } from './zone.types';

export interface ZonesViewModel {
  isLoading: boolean;
  hasData: boolean;
  data: ShippingZone[] | null;
}

export interface ZoneTariffsViewModel {
  isLoading: boolean;
  hasData: boolean;
  data: ShippingZoneTariff[] | null;
}

export interface TariffsViewModel {
  zones: ZonesViewModel;
  zoneTariffs: ZoneTariffsViewModel;
}
