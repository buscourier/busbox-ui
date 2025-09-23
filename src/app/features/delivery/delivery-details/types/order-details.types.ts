import type { AutoPart, ParcelItem } from '@delivery/delivery-details/types';

import type { AdditionalServices } from './additional-services.types';
import type { CargoDetails, CargoType } from './cargo.types';
import type { PackagingDetails } from './packaging.types';

/**
 * UI representation interfaces for order details.
 * Contains structures optimized for displaying order information
 * in the user interface.
 * Used specifically for data display in app-order-summary component.
 */
export interface ActiveOrderDetails {
  cargoType: CargoType | null;
  documents: CargoDetails | null;
  parcels: CargoDetails | null;
  autoParts: CargoDetails | null;
  otherCargo: CargoDetails | null;
  packaging: { items: PackagingDetails[] } | null;
  additionalServices: AdditionalServices | null;
}

export interface OrderReviewDetails {
  cargoType: CargoType | null;
  documents: CargoDetails | null;
  parcels: ParcelItem[] | null;
  autoParts: AutoPart[] | null;
  otherCargo: CargoDetails | null;
  packaging: { items: PackagingDetails[] } | null;
  additionalServices: AdditionalServices | null;
}
