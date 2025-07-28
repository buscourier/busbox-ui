import { InjectionToken } from '@angular/core';

import type { CarouselBreakpoints } from '@shared/components/carousel';

export const DEFAULT_CAROUSEL_BREAKPOINTS: Readonly<CarouselBreakpoints> = {
  default: 1,
  md: 3,
  lg: 4,
};

export const CAROUSEL_BREAKPOINTS = new InjectionToken<CarouselBreakpoints>(
  'CAROUSEL_BREAKPOINTS',
  {
    providedIn: 'root',
    factory: () => DEFAULT_CAROUSEL_BREAKPOINTS,
  },
);
