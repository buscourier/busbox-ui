import { createSelector } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const selectIsZonesLoading = createSelector(
    baseSelectors.selectZonesStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsZonesLoaded = createSelector(
    baseSelectors.selectZonesStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsZonesError = createSelector(
    baseSelectors.selectZonesStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectHasZones = createSelector(
    baseSelectors.selectZones,
    selectIsZonesLoaded,
    (data, isLoaded) => isLoaded && !!data,
  );

  const selectIsZoneTariffsLoading = createSelector(
    baseSelectors.selectZoneTariffsStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsZoneTariffsLoaded = createSelector(
    baseSelectors.selectZoneTariffsStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsZoneTariffsError = createSelector(
    baseSelectors.selectZoneTariffsStatus,
    (status) => status === AsyncStatus.ERROR,
  );

  const selectHasZoneTariffs = createSelector(
    baseSelectors.selectZoneTariffs,
    selectIsZonesLoaded,
    (data, isLoaded) => isLoaded && !!data,
  );

  return {
    selectIsZonesLoading,
    selectIsZonesLoaded,
    selectIsZonesError,
    selectHasZones,
    selectIsZoneTariffsLoading,
    selectIsZoneTariffsLoaded,
    selectIsZoneTariffsError,
    selectHasZoneTariffs,
  };
};
