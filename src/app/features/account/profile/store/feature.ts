import { createFeature } from '@ngrx/store';

import { profileReducer } from './reducer';
import { createBaseSelectors, createDerivedSelectors, createViewModelSelector } from './selectors';

export const profileFeature = createFeature({
  name: 'profile',
  reducer: profileReducer,
  extraSelectors: ({ selectProfileState }) => {
    const baseSelectors = createBaseSelectors(selectProfileState);
    const derivedSelectors = createDerivedSelectors(baseSelectors);
    const viewModelSelector = createViewModelSelector(baseSelectors, derivedSelectors);

    return {
      ...baseSelectors,
      ...derivedSelectors,
      ...viewModelSelector,
    };
  },
});
