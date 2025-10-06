import type { Provider } from '@angular/core';

import { DEFAULT_VALIDATION_LIMITS } from '@core/config';
import { VALIDATION_LIMITS } from '@core/tokens';

export function provideValidationLimits(): Provider {
  return {
    provide: VALIDATION_LIMITS,
    useValue: DEFAULT_VALIDATION_LIMITS,
  };
}
