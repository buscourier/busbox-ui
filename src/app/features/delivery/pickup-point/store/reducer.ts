import { createReducer, on } from '@ngrx/store';

import { FormControlStatus, LoadingStatus } from '@shared/types';

import { PickupPointActions } from './actions';
import type { PickupPointState } from './state';

export const initialState: PickupPointState = {
  cities: {
    items: [],
    status: LoadingStatus.IDLE,
    error: null,
    selected: null,
  },
  offices: {
    items: [],
    status: LoadingStatus.IDLE,
    error: null,
    selected: null,
  },
  courierDetails: null,
  departureDate: new Date().toISOString(),
  form: {
    status: FormControlStatus.INVALID,
    pristine: true,
    touched: false,
    dirty: false,
  },
  activeTabId: null,
};

export const pickupPointReducer = createReducer(
  initialState,
  on(
    PickupPointActions.loadCities,
    (state): PickupPointState => ({
      ...state,
      cities: {
        ...state.cities,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    PickupPointActions.loadCitiesSuccess,
    (state, { cities }): PickupPointState => ({
      ...state,
      cities: {
        ...state.cities,
        items: cities,
        status: LoadingStatus.LOADED,
      },
    }),
  ),
  on(
    PickupPointActions.loadCitiesFailure,
    (state, { error }): PickupPointState => ({
      ...state,
      cities: {
        ...state.cities,
        error,
        status: LoadingStatus.ERROR,
      },
    }),
  ),
  on(
    PickupPointActions.selectCity,
    (state, { city }): PickupPointState => ({
      ...state,
      cities: {
        ...state.cities,
        selected: city,
      },
    }),
  ),
  on(
    PickupPointActions.loadOffices,
    (state): PickupPointState => ({
      ...state,
      offices: {
        ...state.offices,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    PickupPointActions.loadOfficesSuccess,
    (state, { offices }): PickupPointState => ({
      ...state,
      offices: {
        ...state.offices,
        items: offices,
        status: LoadingStatus.LOADED,
      },
    }),
  ),
  on(
    PickupPointActions.loadOfficesFailure,
    (state, { error }): PickupPointState => ({
      ...state,
      offices: {
        ...state.offices,
        error,
        status: LoadingStatus.ERROR,
      },
    }),
  ),
  on(
    PickupPointActions.selectOffice,
    (state, { office }): PickupPointState => ({
      ...state,
      offices: {
        ...state.offices,
        selected: office,
      },
    }),
  ),
  on(
    PickupPointActions.resetOffice,
    (state): PickupPointState => ({
      ...state,
      offices: {
        ...state.offices,
        selected: null,
      },
    }),
  ),
  on(
    PickupPointActions.setActiveTabId,
    (state, { activeTabId }): PickupPointState => ({
      ...state,
      activeTabId,
    }),
  ),
  on(
    PickupPointActions.resetActiveTabId,
    (state): PickupPointState => ({
      ...state,
      activeTabId: null,
    }),
  ),
  on(
    PickupPointActions.updateCourierDetails,
    (state, { courierDetails }): PickupPointState => ({
      ...state,
      courierDetails,
    }),
  ),
  on(
    PickupPointActions.resetCourierDetails,
    (state): PickupPointState => ({
      ...state,
      courierDetails: null,
    }),
  ),
  on(
    PickupPointActions.setFormState,
    (state, { status, pristine, touched, dirty }): PickupPointState => {
      return {
        ...state,
        form: {
          ...state.form,
          status,
          pristine,
          touched,
          dirty,
        },
      };
    },
  ),
  on(
    PickupPointActions.setDepartureDate,
    (state, { departureDate }): PickupPointState => ({
      ...state,
      departureDate,
    }),
  ),
  on(
    PickupPointActions.restoreState,
    (state, { restoredState }): PickupPointState => ({
      ...state,
      activeTabId: restoredState.activeTabId,
      cities: {
        ...state.cities,
        // items: restoredState.cities.items,
        selected: restoredState.cities.selected,
      },
      offices: {
        ...state.offices,
        // items: restoredState.offices.items,
        selected: restoredState.offices.selected,
      },
      courierDetails: restoredState.courierDetails,
      departureDate: restoredState.departureDate,
    }),
  ),

  /**
   * Resets the form with an optional option to keep the selected city.
   * @param keepCity - whether to keep the current city
   * @param city - the new city to set after the reset
   */
  on(PickupPointActions.resetState, (state, { keepCity, city }): PickupPointState => {
    return {
      ...initialState,
      cities: {
        ...state.cities,
        selected: keepCity ? (city ?? state.cities.selected) : null,
      },
      offices: {
        ...state.offices,
        selected: null,
      },
    };
  }),
);
