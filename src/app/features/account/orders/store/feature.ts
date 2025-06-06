import { createFeature } from '@ngrx/store';

import { ordersReducer } from './reducer';
import { createBaseSelectors, createDerivedSelectors, createViewModelSelector } from './selectors';

export const ordersFeature = createFeature({
  name: 'orders',
  reducer: ordersReducer,
  extraSelectors: ({ selectOrdersState }) => {
    const baseSelectors = createBaseSelectors(selectOrdersState);
    const derivedSelectors = createDerivedSelectors(baseSelectors);
    const viewModelSelector = createViewModelSelector(baseSelectors, derivedSelectors);

    return {
      ...baseSelectors,
      ...derivedSelectors,
      ...viewModelSelector,
    };
  },
});
