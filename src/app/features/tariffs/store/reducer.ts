import { createReducer, on } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import { TariffsActions } from './actions';
import { initialState, type TariffsFeatureState } from './state';

export const tariffsReducer = createReducer(
  initialState,
  on(
    TariffsActions.loadZones,
    (state): TariffsFeatureState => ({
      ...state,
      zones: {
        ...state.zones,
        status: AsyncStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    TariffsActions.loadZonesSuccess,
    (state, { data }): TariffsFeatureState => ({
      ...state,
      zones: {
        ...state.zones,
        status: AsyncStatus.LOADED,
        data,
      },
    }),
  ),
  on(
    TariffsActions.loadZonesFailure,
    (state, { error }): TariffsFeatureState => ({
      ...state,
      zones: {
        ...state.zones,
        status: AsyncStatus.ERROR,
        error,
      },
    }),
  ),

  on(
    TariffsActions.loadZoneTariffs,
    (state): TariffsFeatureState => ({
      ...state,
      zoneTariffs: {
        ...state.zoneTariffs,
        status: AsyncStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    TariffsActions.loadZoneTariffsSuccess,
    (state, { data }): TariffsFeatureState => ({
      ...state,
      zoneTariffs: {
        ...state.zoneTariffs,
        status: AsyncStatus.LOADED,
        data,
      },
    }),
  ),
  on(
    TariffsActions.loadZoneTariffsFailure,
    (state, { error }): TariffsFeatureState => ({
      ...state,
      zoneTariffs: {
        ...state.zoneTariffs,
        status: AsyncStatus.ERROR,
        error,
      },
    }),
  ),
  on(
    TariffsActions.selectCity,
    (state, { city }): TariffsFeatureState => ({
      ...state,
      selectedCity: city,
    }),
  ),
);
