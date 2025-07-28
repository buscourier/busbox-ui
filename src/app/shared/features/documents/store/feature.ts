import { createFeature } from '@ngrx/store';

import { documentsReducer } from './reducer';
import { createBaseSelectors, createDerivedSelectors } from './selectors';

export const documentsFeature = createFeature({
  name: 'documents',
  reducer: documentsReducer,
  extraSelectors: ({ selectDocumentsState }) => {
    const baseSelectors = createBaseSelectors(selectDocumentsState);
    const derivedSelectors = createDerivedSelectors(baseSelectors);

    return {
      ...baseSelectors,
      ...derivedSelectors,
    };
  },
});
