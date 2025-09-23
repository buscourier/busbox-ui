import type { FormControl, FormGroup } from '@angular/forms';

import type { ParcelItemDimensions } from '../../../types';

export type ParcelItemForm = FormGroup<{
  quantity: FormControl<number>;
  weight: FormControl<number>;
  dimensions: FormGroup<{
    [K in keyof ParcelItemDimensions]: FormControl<number>;
  }>;
}>;
