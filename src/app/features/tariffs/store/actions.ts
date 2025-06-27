import { createActionGroup, props } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type { ShippingZone, ShippingZoneTariff } from '../types';

export const TariffsActions = createActionGroup({
  source: 'Tariffs',
  events: {
    'Load Zones': props<{ cityId: string }>(),
    'Load Zones Success': props<{ data: ShippingZone[] }>(),
    'Load Zones Failure': props<{ error: ApiError }>(),

    'Load Zone Tariffs': props<{ cityId: string }>(),
    'Load Zone Tariffs Success': props<{ data: ShippingZoneTariff[] }>(),
    'Load Zone Tariffs Failure': props<{ error: ApiError }>(),

    'Select City': props<{ cityId: string }>(),
  },
});
