import type { FormControl, FormGroup } from '@angular/forms';

import type { Filter } from '../../types';

export type FilterForm = FormGroup<{
  [K in keyof Filter]: FormControl<Filter[K] | null>;
}>;
