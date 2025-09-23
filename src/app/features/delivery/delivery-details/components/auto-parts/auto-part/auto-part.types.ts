import type { FormControl, FormGroup } from '@angular/forms';

import type { AutoPartPreset, ParcelItem } from '@delivery/delivery-details/types';

export type AutoPartForm = FormGroup<{
  preset: FormControl<AutoPartPreset | null>;
  params: FormControl<ParcelItem | null>;
}>;
