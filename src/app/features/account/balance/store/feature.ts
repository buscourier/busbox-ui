import { createFeature } from '@ngrx/store';

import { balanceReducer } from './reducer';
import { createBaseSelectors, createDerivedSelectors, createViewModelSelector } from './selectors';

export const balanceFeature = createFeature({
  name: 'balance',
  reducer: balanceReducer,
  extraSelectors: ({ selectBalanceState }) => {
    const baseSelectors = createBaseSelectors(selectBalanceState);
    const derivedSelectors = createDerivedSelectors(baseSelectors);
    const viewModelSelector = createViewModelSelector(baseSelectors, derivedSelectors);

    return {
      ...baseSelectors,
      ...derivedSelectors,
      ...viewModelSelector,
    };
  },
});
