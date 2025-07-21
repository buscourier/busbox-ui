import { createSelector, type MemoizedSelector } from '@ngrx/store';

import { LoadingStatus } from '@shared/types';

import type { LocationsState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type LocationsStateSelector = MemoizedSelector<object, LocationsState>;

export const createBaseSelectors = (
  selectLocationsState: LocationsStateSelector,
): BaseSelectors => {
  const selectPickupCitiesState = createSelector(
    selectLocationsState,
    (state) => state.pickupCities,
  );

  const selectDeliveryCitiesState = createSelector(
    selectLocationsState,
    (state) => state.deliveryCities,
  );

  const selectOfficesState = createSelector(selectLocationsState, (state) => state.offices);

  return {
    selectIsPickupCitiesLoading: createSelector(
      selectPickupCitiesState,
      (state) => state.status === LoadingStatus.LOADING,
    ),
    selectIsPickupCitiesLoaded: createSelector(
      selectPickupCitiesState,
      (state) => state.status === LoadingStatus.LOADED,
    ),
    selectPickupCities: createSelector(selectPickupCitiesState, (state) => state.items),
    selectPickupCitiesError: createSelector(selectPickupCitiesState, (state) => state.error),

    selectIsDeliveryCitiesLoading: createSelector(
      selectDeliveryCitiesState,
      (state) => state.status === LoadingStatus.LOADING,
    ),
    selectIsDeliveryCitiesLoaded: createSelector(
      selectDeliveryCitiesState,
      (state) => state.status === LoadingStatus.LOADED,
    ),
    selectDeliveryCities: createSelector(selectDeliveryCitiesState, (state) => state.items),
    selectDeliveryCitiesError: createSelector(selectDeliveryCitiesState, (state) => state.error),

    selectIsOfficesLoading: createSelector(
      selectOfficesState,
      (state) => state.status === LoadingStatus.LOADING,
    ),
    selectIsOfficesLoaded: createSelector(
      selectOfficesState,
      (state) => state.status === LoadingStatus.LOADED,
    ),
    selectOffices: createSelector(selectOfficesState, (state) => state.items),
    selectOfficesError: createSelector(selectOfficesState, (state) => state.error),
  };
};
