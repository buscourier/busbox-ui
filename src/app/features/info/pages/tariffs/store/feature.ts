import { createFeature } from '@ngrx/store';

import { tariffsReducer } from './reducer';
import { createBaseSelectors, createDerivedSelectors, createViewModelSelector } from './selectors';

export const tariffsFeature = createFeature({
  name: 'tariffs',
  reducer: tariffsReducer,
  extraSelectors: ({ selectTariffsState }) => {
    const baseSelectors = createBaseSelectors(selectTariffsState);
    const derivedSelectors = createDerivedSelectors(baseSelectors);
    const viewModelSelector = createViewModelSelector(baseSelectors, derivedSelectors);

    return {
      ...baseSelectors,
      ...derivedSelectors,
      ...viewModelSelector,
    };
  },
});
