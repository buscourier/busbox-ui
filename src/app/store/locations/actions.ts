import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError, DeliveryCity, Office, PickupCity } from '@shared/types';

export const LocationsActions = createActionGroup({
  source: 'Locations',
  events: {
    'Load Pickup Cities': emptyProps(),
    'Load Pickup Cities Success': props<{ cities: PickupCity[] }>(),
    'Load Pickup Cities Failure': props<{ error: ApiError }>(),

    'Load Delivery Cities': props<{ pickupCityId: string }>(),
    'Load Delivery Cities Success': props<{ cities: DeliveryCity[] }>(),
    'Load Delivery Cities Failure': props<{ error: ApiError }>(),

    'Load Offices': emptyProps(),
    'Load Offices Success': props<{ offices: Office[] }>(),
    'Load Offices Failure': props<{ error: ApiError }>(),

    'Clear Delivery Cities': emptyProps(),
    'Clear All Cache': emptyProps(),
  },
});
