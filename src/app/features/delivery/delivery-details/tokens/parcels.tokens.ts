import { InjectionToken, type Signal } from '@angular/core';

import type { ParcelItemLimits, ParcelsLimits } from '../types';

export const PARCELS_LIMIT_TOKEN = new InjectionToken<Signal<ParcelsLimits>>('Parcels limits');

export const PARCEL_ITEM_LIMIT_TOKEN = new InjectionToken<Signal<ParcelItemLimits>>(
  'Parcel item limits',
);
