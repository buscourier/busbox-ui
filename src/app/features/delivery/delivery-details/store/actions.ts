import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type {
  AdditionalServices,
  AutoParts,
  CargoType,
  DeliveryOptions,
  Documents,
  OrderValidationState,
  OtherCargo,
  Packaging,
  Parcels,
  StoredDeliveryDetailsState,
} from '../types';

export const DeliveryDetailsActions = createActionGroup({
  source: 'DeliveryDetails',
  events: {
    'Load Options': props<{
      pickupCityId: string;
      deliveryCityId: string;
    }>(),
    'Load Options Success': props<{
      options: DeliveryOptions;
    }>(),
    'Load Options Failure': props<{
      error: ApiError;
    }>(),
    'Skip Load Options': emptyProps(),
    // 'Clear Parcel Restrictions': emptyProps(),
    'Reset Options': emptyProps(),
    'Restore State': props<{
      restoredState: StoredDeliveryDetailsState;
    }>(),
  },
});

export const OrderActions = createActionGroup({
  source: 'Order',
  events: {
    Add: emptyProps(),
    Remove: props<{
      orderId: string;
    }>(),
    'Set Active': props<{
      orderId: string;
    }>(),
    'Set Cargo Type': props<{
      orderId: string;
      cargoType: CargoType;
    }>(),
    'Update Data': props<{
      orderId: string;
      data: Partial<{
        documents: Documents;
        parcels: Parcels;
        autoParts: AutoParts;
        otherCargo: OtherCargo;
        packaging: Packaging;
        additionalServices: AdditionalServices;
      }>;
    }>(),
    'Update Validation': props<{
      orderId: string;
      validation: Partial<OrderValidationState>;
    }>(),
    // 'Restore Skipped': emptyProps(),
    // Reset: emptyProps(),
  },
});
//
// export const PersistenceActions = createActionGroup({
//   source: 'Persistence',
//   events: {
//     'Restore State': props<{
//       restoredState: StoredOrdersState;
//     }>(),
//     'Restore Skipped': emptyProps(),
//   },
// });
