import type { FormControl, FormGroup } from '@angular/forms';

import type { Confidant } from '@shared/types';

export interface ConfidantInfo {
  confidant: Confidant;
  phone: string;
}

export type ConfidantForm = FormGroup<{
  [K in keyof ConfidantInfo]: FormControl<ConfidantInfo[K] | null>;
}>;
