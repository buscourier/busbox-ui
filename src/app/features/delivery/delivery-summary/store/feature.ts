import { createFeature } from '@ngrx/store';

import { deliverySummaryReducer } from './reducer';
import { createBaseSelectors, createDerivedSelectors, createViewModelSelector } from './selectors';

export const deliverySummaryFeature = createFeature({
  name: 'deliverySummary',
  reducer: deliverySummaryReducer,
  extraSelectors: ({ selectDeliverySummaryState }) => {
    const baseSelectors = createBaseSelectors(selectDeliverySummaryState);
    const derivedSelectors = createDerivedSelectors(baseSelectors);
    const viewModelSelector = createViewModelSelector(baseSelectors, derivedSelectors);

    return {
      ...baseSelectors,
      ...viewModelSelector,
    };
  },
});
