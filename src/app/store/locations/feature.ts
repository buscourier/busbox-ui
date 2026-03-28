import { createFeature } from '@ngrx/store';

import { locationsReducer } from './reducer';
import { createBaseSelectors, createDerivedSelectors } from './selectors';

export const locationsFeature = createFeature({
  name: 'locations',
  reducer: locationsReducer,
  extraSelectors: ({ selectLocationsState }) => {
    const baseSelectors = createBaseSelectors(selectLocationsState);
    const derivedSelectors = createDerivedSelectors(baseSelectors);

    return {
      ...baseSelectors,
      ...derivedSelectors,
    };
  },
});
