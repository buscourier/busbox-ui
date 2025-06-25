import { createSelector } from '@ngrx/store';

import type { ConfidantsViewModel, FieldsViewModel, ProfileViewModel } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createViewModelSelector = (
  baseSelectors: BaseSelectors,
  derivedSelectors: DerivedSelectors,
) => {
  const selectFieldsViewModel = createSelector(
    derivedSelectors.selectIsFieldsLoading,
    derivedSelectors.selectIsFieldsLoaded,
    derivedSelectors.selectIsFieldsUpdating,
    derivedSelectors.selectIsFieldsUpdated,
    derivedSelectors.selectPersonalFields,
    derivedSelectors.selectOrganizationFields,
    derivedSelectors.selectDiscountField,
    baseSelectors.selectFieldsError,
    (
      isLoading,
      isLoaded,
      isUpdating,
      isUpdated,
      personalFields,
      organizationFields,
      discountField,
      error,
    ): FieldsViewModel => ({
      isLoading,
      isLoaded,
      isUpdating,
      isUpdated,
      personalFields,
      organizationFields,
      discountField,
      error,
    }),
  );

  const selectConfidantsViewModel = createSelector(
    derivedSelectors.selectIsConfidantsLoading,
    derivedSelectors.selectIsConfidantsLoaded,
    baseSelectors.selectConfidants,
    baseSelectors.selectConfidantsError,
    (isLoading, isLoaded, confidants, error): ConfidantsViewModel => ({
      isLoading,
      isLoaded,
      confidants,
      error,
    }),
  );

  return {
    selectViewModel: createSelector(
      selectFieldsViewModel,
      selectConfidantsViewModel,
      (fields, confidants): ProfileViewModel => ({
        fields,
        confidants,
      }),
    ),
  };
};
