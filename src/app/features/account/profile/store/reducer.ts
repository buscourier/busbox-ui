import { createReducer, on } from '@ngrx/store';

import { LoadingStatus } from '@shared/types';

import { ProfileActions } from './actions';
import { initialState, type ProfileFeatureState } from './state';

export const profileReducer = createReducer(
  initialState,
  on(
    ProfileActions.getFields,
    (state): ProfileFeatureState => ({
      ...state,
      fields: {
        ...state.fields,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    ProfileActions.getFieldsSuccess,
    (state, { items }): ProfileFeatureState => ({
      ...state,
      fields: {
        ...state.fields,
        status: LoadingStatus.LOADED,
        items,
      },
    }),
  ),
  on(
    ProfileActions.getFieldsFailure,
    (state, { error }): ProfileFeatureState => ({
      ...state,
      fields: {
        ...state.fields,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),

  on(
    ProfileActions.updateFields,
    (state): ProfileFeatureState => ({
      ...state,
      fields: {
        ...state.fields,
        isUpdating: true,
        updateError: null,
      },
    }),
  ),
  on(
    ProfileActions.updateFieldsSuccess,
    (state, { items }): ProfileFeatureState => ({
      ...state,
      fields: {
        ...state.fields,
        isUpdating: false,
        items,
      },
    }),
  ),
  on(
    ProfileActions.updateFieldsFailure,
    (state, { error }): ProfileFeatureState => ({
      ...state,
      fields: {
        ...state.fields,
        isUpdating: false,
        updateError: error,
      },
    }),
  ),

  on(
    ProfileActions.getConfidants,
    (state): ProfileFeatureState => ({
      ...state,
      confidants: {
        ...state.confidants,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    ProfileActions.getConfidantsSuccess,
    (state, { items }): ProfileFeatureState => ({
      ...state,
      confidants: {
        ...state.confidants,
        status: LoadingStatus.LOADED,
        items,
      },
    }),
  ),
  on(
    ProfileActions.getConfidantsFailure,
    (state, { error }): ProfileFeatureState => ({
      ...state,
      confidants: {
        ...state.confidants,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),
);
