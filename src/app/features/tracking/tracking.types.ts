import type { FormGroup, FormControl } from '@angular/forms';

export type TrackingForm = FormGroup<{
  orderNumber: FormControl<string>;
}>;
