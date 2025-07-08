import type { PickupCity } from '@shared/types';

import type { ParcelsTableData, TableData } from './table.types';
import type { ShippingZone } from './zone.types';

export interface ZonesViewModel {
  isLoading: boolean;
  hasData: boolean;
  data: ShippingZone[] | null;
}

export interface ZoneTariffsViewModel {
  isLoading: boolean;
  hasData: boolean;
  parcelsTable: ParcelsTableData;
  autopartsTable: TableData;
  otherTable: TableData;
}

export interface TariffsViewModel {
  zones: ZonesViewModel;
  zoneTariffs: ZoneTariffsViewModel;
  selectedCity: PickupCity | null;
}
