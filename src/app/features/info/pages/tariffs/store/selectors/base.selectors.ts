import { createSelector, type MemoizedSelector } from '@ngrx/store';

import type { TariffsFeatureState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type TariffsFeatureStateSelector = MemoizedSelector<object, TariffsFeatureState>;

export const createBaseSelectors = (
  selectTariffsFeatureState: TariffsFeatureStateSelector,
): BaseSelectors => {
  const selectZonesState = createSelector(selectTariffsFeatureState, (state) => state.zones);
  const selectZoneTariffsState = createSelector(
    selectTariffsFeatureState,
    (state) => state.zoneTariffs,
  );

  return {
    selectZonesStatus: createSelector(selectZonesState, (zones) => zones.status),
    selectZones: createSelector(selectZonesState, (zones) => zones.data),
    selectZonesError: createSelector(selectZonesState, (zones) => zones.error),

    selectZoneTariffsStatus: createSelector(selectZoneTariffsState, (tariffs) => tariffs.status),
    selectZoneTariffs: createSelector(selectZoneTariffsState, (tariffs) => tariffs.data || []),
    selectZoneTariffsError: createSelector(selectZoneTariffsState, (tariffs) => tariffs.error),

    selectSelectedCity: createSelector(selectTariffsFeatureState, (state) => state.selectedCity),
  };
};
