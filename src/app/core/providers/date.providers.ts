import type { Provider } from '@angular/core';
import { tuiInputDateOptionsProviderNew, tuiInputDateRangeOptionsProvider } from '@taiga-ui/kit';

import { CustomDateRangeTransformer, CustomDateTransformer } from '@core/transformers';

export const DATE_PROVIDERS: Provider[] = [
  tuiInputDateOptionsProviderNew({
    valueTransformer: new CustomDateTransformer(),
  }),
  tuiInputDateRangeOptionsProvider({
    valueTransformer: new CustomDateRangeTransformer(),
  }),
];
