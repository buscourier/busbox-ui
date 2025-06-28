import { createSelector } from '@ngrx/store';

import type { TariffsViewModel, ZonesViewModel, ZoneTariffsViewModel } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createViewModelSelector = (
  baseSelectors: BaseSelectors,
  derivedSelectors: DerivedSelectors,
) => {
  const selectZonesViewModel = createSelector(
    derivedSelectors.selectIsZonesLoading,
    derivedSelectors.selectHasZones,
    baseSelectors.selectZones,
    (isLoading, hasData, data): ZonesViewModel => ({ isLoading, hasData, data }),
  );

  const selectZoneTariffsViewModel = createSelector(
    derivedSelectors.selectIsZoneTariffsLoading,
    derivedSelectors.selectHasZoneTariffs,
    derivedSelectors.selectParcelsTable,
    derivedSelectors.selectAutoPartsTable,
    derivedSelectors.selectOtherTable,
    (isLoading, hasData, parcelsTable, autopartsTable, otherTable): ZoneTariffsViewModel => ({
      isLoading,
      hasData,
      parcelsTable,
      autopartsTable,
      otherTable,
    }),
  );

  return {
    selectViewModel: createSelector(
      selectZonesViewModel,
      selectZoneTariffsViewModel,
      baseSelectors.selectSelectedCity,
      (zones, zoneTariffs, selectedCity): TariffsViewModel => ({
        zones,
        zoneTariffs,
        selectedCity,
      }),
    ),
  };
};
