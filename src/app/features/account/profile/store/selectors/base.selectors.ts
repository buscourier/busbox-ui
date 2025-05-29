import { createSelector, type MemoizedSelector } from '@ngrx/store';

import { LoadingStatus } from '@shared/types';

import type { ProfileFeatureState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type ProfileFeatureStateSelector = MemoizedSelector<object, ProfileFeatureState>;

export const createBaseSelectors = (
  selectProfileFeatureState: ProfileFeatureStateSelector,
): BaseSelectors => {
  const selectFieldsState = createSelector(selectProfileFeatureState, (state) => state.fields);
  const selectConfidantsState = createSelector(
    selectProfileFeatureState,
    (state) => state.confidants,
  );

  return {
    selectIsFieldsLoading: createSelector(
      selectFieldsState,
      (fields) => fields.status === LoadingStatus.LOADING,
    ),
    selectIsFieldsLoaded: createSelector(
      selectFieldsState,
      (fields) => fields.status === LoadingStatus.LOADED,
    ),
    selectIsFieldsUpdating: createSelector(selectFieldsState, (fields) => fields.isUpdating),
    selectFieldsError: createSelector(selectFieldsState, (fields) => fields.error),
    selectFieldsUpdateError: createSelector(selectFieldsState, (fields) => fields.updateError),
    selectFields: createSelector(selectFieldsState, (fields) => fields.items),

    selectIsConfidantsLoading: createSelector(
      selectConfidantsState,
      (confidants) => confidants.status === LoadingStatus.LOADING,
    ),
    selectIsConfidantsLoaded: createSelector(
      selectConfidantsState,
      (confidants) => confidants.status === LoadingStatus.LOADED,
    ),
    selectConfidantsError: createSelector(selectConfidantsState, (confidants) => confidants.error),
    selectConfidants: createSelector(selectConfidantsState, (confidants) => confidants.items),
  };
};
