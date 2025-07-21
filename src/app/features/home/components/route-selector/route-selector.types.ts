import type { FormControl, FormGroup } from '@angular/forms';

import type { DeliveryCity, PickupCity } from '@shared/types';

export type RouteSelectorForm = FormGroup<{
  pickupCity: FormControl<PickupCity | null>;
  deliveryCity: FormControl<DeliveryCity | null>;
}>;
