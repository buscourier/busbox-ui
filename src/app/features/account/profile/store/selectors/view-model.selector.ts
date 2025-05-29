import { createSelector } from '@ngrx/store';

import type { ConfidantsViewModel, FieldsViewModel, ProfileViewModel } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createViewModelSelector = (
  baseSelectors: BaseSelectors,
  derivedSelectors: DerivedSelectors,
) => {
  const selectFieldsViewModel = createSelector(
    baseSelectors.selectIsFieldsLoading,
    baseSelectors.selectIsFieldsLoaded,
    baseSelectors.selectIsFieldsUpdating,
    derivedSelectors.selectPersonalFields,
    derivedSelectors.selectOrganizationFields,
    derivedSelectors.selectDiscountField,
    baseSelectors.selectFieldsError,
    (
      isLoading,
      isLoaded,
      isUpdating,
      personalFields,
      organizationFields,
      discountField,
      error,
    ): FieldsViewModel => ({
      isLoading,
      isLoaded,
      isUpdating,
      personalFields,
      organizationFields,
      discountField,
      error,
    }),
  );

  const selectConfidantsViewModel = createSelector(
    baseSelectors.selectIsConfidantsLoading,
    baseSelectors.selectIsConfidantsLoaded,
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
      derivedSelectors.selectErrorStatus,
      (fields, confidants, errorStatus): ProfileViewModel => ({
        fields,
        confidants,
        errorStatus,
      }),
    ),
  };
};
