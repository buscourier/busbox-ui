import { createFeature } from '@ngrx/store';

import { newsReducer } from './reducer';
import { createBaseSelectors, createDerivedSelectors, createViewModelSelector } from './selectors';

export const newsFeature = createFeature({
  name: 'news',
  reducer: newsReducer,
  extraSelectors: ({ selectNewsState }) => {
    const baseSelectors = createBaseSelectors(selectNewsState);
    const derivedSelectors = createDerivedSelectors(baseSelectors);
    const viewModelSelector = createViewModelSelector(baseSelectors, derivedSelectors);

    return {
      ...baseSelectors,
      ...derivedSelectors,
      ...viewModelSelector,
    };
  },
});
