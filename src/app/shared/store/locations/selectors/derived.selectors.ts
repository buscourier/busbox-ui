import { createSelector } from '@ngrx/store';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => ({
  selectErrorStatus: createSelector(
    baseSelectors.selectPickupCitiesError,
    baseSelectors.selectDeliveryCitiesError,
    baseSelectors.selectOfficesError,
    (pickupCitiesError, deliveryCitiesError, officesError) => ({
      pickupCitiesError,
      deliveryCitiesError,
      officesError,
      hasAnyError: !!pickupCitiesError || !!deliveryCitiesError || !!officesError,
    }),
  ),

  selectPickupCityById: (id: string) =>
    createSelector(
      baseSelectors.selectPickupCities,
      (cities) => cities.find((city) => city.id === id) || null,
    ),
});
