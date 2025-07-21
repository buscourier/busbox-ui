import { createReducer, on } from '@ngrx/store';

import { LoadingStatus } from '@shared/types';

import { LocationsActions } from './actions';
import { initialState, type LocationsState } from './state';

export const locationsReducer = createReducer(
  initialState,
  on(
    LocationsActions.loadPickupCities,
    (state): LocationsState => ({
      ...state,
      pickupCities: {
        ...state.pickupCities,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    LocationsActions.loadPickupCitiesSuccess,
    (state, { cities }): LocationsState => ({
      ...state,
      pickupCities: {
        ...state.pickupCities,
        status: LoadingStatus.LOADED,
        items: cities,
      },
    }),
  ),
  on(
    LocationsActions.loadPickupCitiesFailure,
    (state, { error }): LocationsState => ({
      ...state,
      pickupCities: {
        ...state.pickupCities,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),

  on(
    LocationsActions.loadDeliveryCities,
    (state): LocationsState => ({
      ...state,
      deliveryCities: {
        ...state.deliveryCities,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    LocationsActions.loadDeliveryCitiesSuccess,
    (state, { cities }): LocationsState => ({
      ...state,
      deliveryCities: {
        ...state.deliveryCities,
        status: LoadingStatus.LOADED,
        items: cities,
      },
    }),
  ),
  on(
    LocationsActions.loadDeliveryCitiesFailure,
    (state, { error }): LocationsState => ({
      ...state,
      deliveryCities: {
        ...state.deliveryCities,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),

  on(
    LocationsActions.loadOffices,
    (state): LocationsState => ({
      ...state,
      offices: {
        ...state.offices,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    LocationsActions.loadOfficesSuccess,
    (state, { offices }): LocationsState => ({
      ...state,
      offices: {
        ...state.offices,
        status: LoadingStatus.LOADED,
        items: offices,
      },
    }),
  ),
  on(
    LocationsActions.loadOfficesFailure,
    (state, { error }): LocationsState => ({
      ...state,
      offices: {
        ...state.offices,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),
);
