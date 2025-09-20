import { InjectionToken, type Signal } from '@angular/core';

import type { CargoItemRestrictions } from '../types';

export const CARGO_LIMITS = new InjectionToken<Signal<CargoItemRestrictions>>('Cargo limits');
