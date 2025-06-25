import { createReducer, on } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import { ProfileActions } from './actions';
import { initialState, type ProfileFeatureState } from './state';

export const profileReducer = createReducer(
  initialState,
  on(
    ProfileActions.loadFields,
    (state): ProfileFeatureState => ({
      ...state,
      fields: {
        ...state.fields,
        status: AsyncStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    ProfileActions.loadFieldsSuccess,
    (state, { data }): ProfileFeatureState => ({
      ...state,
      fields: {
        ...state.fields,
        status: AsyncStatus.LOADED,
        data,
      },
    }),
  ),
  on(
    ProfileActions.loadFieldsFailure,
    (state, { error }): ProfileFeatureState => ({
      ...state,
      fields: {
        ...state.fields,
        status: AsyncStatus.ERROR,
        error,
      },
    }),
  ),

  on(
    ProfileActions.loadConfidants,
    (state): ProfileFeatureState => ({
      ...state,
      confidants: {
        ...state.confidants,
        status: AsyncStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    ProfileActions.loadConfidantsSuccess,
    (state, { data }): ProfileFeatureState => ({
      ...state,
      confidants: {
        ...state.confidants,
        status: AsyncStatus.LOADED,
        data,
      },
    }),
  ),
  on(
    ProfileActions.loadConfidantsFailure,
    (state, { error }): ProfileFeatureState => ({
      ...state,
      confidants: {
        ...state.confidants,
        status: AsyncStatus.ERROR,
        error,
      },
    }),
  ),

  on(
    ProfileActions.updateFields,
    (state): ProfileFeatureState => ({
      ...state,
      operations: {
        ...state.operations,
        updateFields: {
          status: AsyncStatus.LOADING,
          data: [],
          error: null,
        },
      },
    }),
  ),

  on(
    ProfileActions.updateFieldsSuccess,
    (state, { data }): ProfileFeatureState => ({
      ...state,
      fields: {
        ...state.fields,
        data,
      },
      operations: {
        ...state.operations,
        updateFields: {
          status: AsyncStatus.LOADED,
          data,
          error: null,
        },
      },
    }),
  ),

  on(
    ProfileActions.updateFieldsFailure,
    (state, { error }): ProfileFeatureState => ({
      ...state,
      operations: {
        ...state.operations,
        updateFields: {
          status: AsyncStatus.ERROR,
          data: [],
          error,
        },
      },
    }),
  ),
);
