import { createSelector } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import { ORGANIZATION_FIELD_ALIASES, PERSONAL_FIELD_ALIASES } from '../../constants';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const selectIsFieldsLoading = createSelector(
    baseSelectors.selectFieldsStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsFieldsLoaded = createSelector(
    baseSelectors.selectFieldsStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectHasFieldsError = createSelector(
    baseSelectors.selectFieldsStatus,
    (status) => status === AsyncStatus.ERROR,
  );

  const selectPersonalFields = createSelector(baseSelectors.selectFields, (fields) => {
    if (!fields) return [];

    return fields.filter((field) =>
      PERSONAL_FIELD_ALIASES.some((alias) => field.alias.toLowerCase().includes(alias)),
    );
  });

  const selectOrganizationFields = createSelector(baseSelectors.selectFields, (fields) => {
    if (!fields) return [];

    return fields.filter((field) =>
      ORGANIZATION_FIELD_ALIASES.some((alias) => field.alias.toLowerCase().includes(alias)),
    );
  });

  const selectDiscountField = createSelector(baseSelectors.selectFields, (fields) => {
    if (!fields) return null;

    return fields.find((field) => field.alias.toLowerCase().includes('urdiscount')) || null;
  });

  const selectIsConfidantsLoading = createSelector(
    baseSelectors.selectConfidantsStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsConfidantsLoaded = createSelector(
    baseSelectors.selectConfidantsStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectHasConfidantsError = createSelector(
    baseSelectors.selectConfidantsStatus,
    (status) => status === AsyncStatus.ERROR,
  );

  const selectIsFieldsUpdating = createSelector(
    baseSelectors.selectUpdateFieldsStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsFieldsUpdated = createSelector(
    baseSelectors.selectUpdateFieldsStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectHasFieldsUpdateError = createSelector(
    baseSelectors.selectUpdateFieldsStatus,
    (status) => status === AsyncStatus.ERROR,
  );

  return {
    selectIsFieldsLoading,
    selectIsFieldsLoaded,
    selectHasFieldsError,
    selectPersonalFields,
    selectOrganizationFields,
    selectDiscountField,
    selectIsConfidantsLoading,
    selectIsConfidantsLoaded,
    selectHasConfidantsError,
    selectIsFieldsUpdating,
    selectIsFieldsUpdated,
    selectHasFieldsUpdateError,
  };
};
