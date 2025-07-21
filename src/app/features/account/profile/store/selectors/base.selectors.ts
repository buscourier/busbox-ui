import { createSelector, type MemoizedSelector } from '@ngrx/store';

import type { ProfileFeatureState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type ProfileFeatureStateSelector = MemoizedSelector<object, ProfileFeatureState>;

export const createBaseSelectors = (
  selectProfileFeatureState: ProfileFeatureStateSelector,
): BaseSelectors => {
  // ===== STATE SLICES =====
  const selectFieldsState = createSelector(selectProfileFeatureState, (profile) => profile.fields);

  const selectConfidantsState = createSelector(
    selectProfileFeatureState,
    (profile) => profile.confidants,
  );

  const selectOperationsState = createSelector(
    selectProfileFeatureState,
    (profile) => profile.operations,
  );

  const selectUpdateFieldsState = createSelector(
    selectOperationsState,
    (operations) => operations.updateFields,
  );

  return {
    // ===== FIELDS SELECTORS =====
    selectFieldsStatus: createSelector(selectFieldsState, (fields) => fields.status),
    selectFields: createSelector(selectFieldsState, (fields) => fields.data || []),
    selectFieldsError: createSelector(selectFieldsState, (fields) => fields.error),

    // ===== UPDATE ORGANIZATION SELECTORS =====
    selectUpdateFieldsStatus: createSelector(selectUpdateFieldsState, (update) => update.status),
    selectUpdateFieldsData: createSelector(selectUpdateFieldsState, (update) => update.data || []),
    selectUpdateFieldsError: createSelector(selectUpdateFieldsState, (update) => update.error),

    // ===== CONFIDANTS SELECTORS =====
    selectConfidantsStatus: createSelector(
      selectConfidantsState,
      (confidants) => confidants.status,
    ),
    selectConfidants: createSelector(selectConfidantsState, (confidants) => confidants.data || []),
    selectConfidantsError: createSelector(selectConfidantsState, (confidants) => confidants.error),
  };
};
