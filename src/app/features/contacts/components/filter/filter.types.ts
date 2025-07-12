import type { FormControl, FormGroup } from '@angular/forms';

import type { PickupCity } from '@shared/types';

import type { PointType } from '../../types';

export interface Filter {
  city: PickupCity | null;
  point: PointType | null;
}

export type FilterForm = FormGroup<{
  [K in keyof Filter]: FormControl<Filter[K] | null>;
}>;
