import { createSelector } from '@ngrx/store';

import type { DeliveryDetailsViewModel } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createViewModelSelector = (
  baseSelectors: BaseSelectors,
  derivedSelectors: DerivedSelectors,
) => {
  const selectOptionsViewModel = createSelector(
    baseSelectors.selectIsOptionsLoading,
    baseSelectors.selectIsOptionsLoaded,
    baseSelectors.selectOptionsError,
    derivedSelectors.selectCargoTypes,
    derivedSelectors.selectAutoPartsOptions,
    derivedSelectors.selectOtherCargosOptions,
    derivedSelectors.selectAdditionalServicesOptions,
    derivedSelectors.selectPackagingOptions,
    (
      isLoading,
      isLoaded,
      error,
      cargoTypes,
      autoParts,
      otherCargos,
      additionalServices,
      packaging,
    ) => ({
      isLoading,
      isLoaded,
      error,
      cargoTypes,
      autoParts,
      otherCargos,
      additionalServices,
      packaging,
    }),
  );

  const selectOrdersViewModel = createSelector(
    derivedSelectors.selectEnhancedOrders,
    derivedSelectors.selectActiveOrder,
    derivedSelectors.selectIsActiveOrderValid,
    derivedSelectors.selectIsAllOrdersValid,
    (items, active, isActiveValid, isAllValid) => ({
      items,
      active,
      isActiveValid,
      isAllValid,
    }),
  );

  return {
    selectViewModel: createSelector(
      selectOrdersViewModel,
      selectOptionsViewModel,
      (orders, options): DeliveryDetailsViewModel => ({
        orders,
        options,
      }),
    ),
  };
};
