import { createSelector } from '@ngrx/store';

import { ORGANIZATION_FIELD_ALIASES, PERSONAL_FIELD_ALIASES } from '../../constants';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => ({
  selectPersonalFields: createSelector(baseSelectors.selectFields, (fields) => {
    return fields.filter((field) =>
      PERSONAL_FIELD_ALIASES.some((alias) => field.alias.toLowerCase().includes(alias)),
    );
  }),
  selectOrganizationFields: createSelector(baseSelectors.selectFields, (fields) => {
    return fields.filter((field) =>
      ORGANIZATION_FIELD_ALIASES.some((alias) => field.alias.toLowerCase().includes(alias)),
    );
  }),
  selectDiscountField: createSelector(baseSelectors.selectFields, (fields) => {
    return fields.find((field) => field.alias.toLowerCase().includes('urdiscount')) || null;
  }),
  selectErrorStatus: createSelector(
    baseSelectors.selectFieldsError,
    baseSelectors.selectFieldsUpdateError,
    baseSelectors.selectConfidantsError,
    (fieldsError, fieldsUpdateError, confidantsError) => ({
      fieldsError,
      fieldsUpdateError,
      confidantsError,
      hasAnyError: !!fieldsError || !!fieldsUpdateError || !!confidantsError,
    }),
  ),
});
