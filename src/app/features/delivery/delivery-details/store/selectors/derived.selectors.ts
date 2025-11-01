import { createSelector } from '@ngrx/store';

import { PACKAGING_NAMES } from '@delivery/delivery-details/constants';

import {
  type ActiveOrderDetails,
  CargoType,
  CargoTypeId,
  type Order,
  type OrderReviewDetails,
  type PackagingDetails,
  type Service,
} from '../../types';
import { getAutoParts, getDocuments, getOtherCargo, getParcels } from '../../utils';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const isOrderValid = (order: Order): boolean => {
    const { cargoType, validation } = order;

    if (!cargoType) return false;

    const isCargoValid = (() => {
      switch (cargoType) {
        case CargoType.DOCUMENTS:
          return validation.documents ?? false;
        case CargoType.PARCELS:
          return validation.parcels ?? false;
        case CargoType.AUTO_PARTS:
          return validation.autoParts ?? false;
        case CargoType.OTHER:
          return validation.otherCargo ?? false;
        default:
          return false;
      }
    })();

    return (
      isCargoValid && (validation.packaging ?? true) && (validation.additionalServices ?? true)
    );
  };

  const selectActiveOrder = createSelector(
    baseSelectors.selectEntities,
    baseSelectors.selectActiveOrderId,
    (entities, activeId) => {
      if (!activeId) return null;
      return entities[activeId] ?? null;
    },
  );

  const selectIsActiveOrderValid = createSelector(selectActiveOrder, (order): boolean => {
    if (!order) return false;

    return isOrderValid(order);
  });

  const selectEnhancedOrders = createSelector(
    baseSelectors.selectAll,
    baseSelectors.selectActiveOrderId,
    selectIsActiveOrderValid,
    (orders, activeId, isActiveOrderValid) =>
      orders.map((order, index) => ({
        ...order,
        number: index + 1,
        isActive: order.id === activeId,
        isActiveInvalid: order.id === activeId && !isActiveOrderValid,
        isDisabled: order.id !== activeId && !isActiveOrderValid,
      })),
  );

  const selectIsAllOrdersValid = createSelector(baseSelectors.selectAll, (orders): boolean => {
    if (!orders.length) return true;

    return orders.every((order) => isOrderValid(order));
  });

  const selectCargoTypes = createSelector(baseSelectors.selectOptions, (options) => {
    const cargos = Array.isArray(options?.cargos) ? options.cargos : [];

    return cargos.filter((cargo) => cargo.parent_id === CargoTypeId.ROOT && cargo.id !== '21');
  });

  // const selectAutoPartsOptions = createSelector(baseSelectors.selectOptions, (options) => {
  //   const cargos = Array.isArray(options?.cargos) ? options.cargos : [];
  //
  //   return cargos.filter((cargo) => cargo.parent_id === CargoTypeId.AUTO_PARTS);
  // });

  const selectAutoPartsOptions = createSelector(baseSelectors.selectOptions, (options) => {
    return Array.isArray(options?.autoPartPresets) ? options.autoPartPresets : [];
  });

  const selectOtherCargosOptions = createSelector(baseSelectors.selectOptions, (options) => {
    const cargos = Array.isArray(options?.cargos) ? options.cargos : [];

    return cargos.filter((cargo) => cargo.parent_id === CargoTypeId.OTHER);
  });

  const selectAdditionalServicesOptions = createSelector(
    baseSelectors.selectOptions,
    (options): Service[] => {
      const services = options?.services || [];

      return services.filter((service) => service.group_id === '3') || [];
    },
  );

  const selectPackagingOptions = createSelector(
    baseSelectors.selectOptions,
    (options) => options?.services.filter((service) => service.group_id === '1') || [],
  );

  const selectActiveOrderPackaging = createSelector(
    selectActiveOrder,
    selectPackagingOptions,
    (order, packaging): { items: PackagingDetails[] } | null => {
      if (!order?.packaging?.items.length) return null;

      const servicesMap = new Map(packaging.map((item) => [item.id, item]));

      return {
        items: order.packaging.items.map((item) => ({
          type:
            PACKAGING_NAMES[servicesMap.get(item.id)?.subgroup_id || ''] ||
            'Unknown packaging type',
          variant: servicesMap.get(item.id)?.site_name || '',
          price: servicesMap.get(item.id)?.price || '',
          quantity: item.quantity,
        })),
      };
    },
  );

  const selectActiveOrderDetails = createSelector(
    selectActiveOrder,
    selectActiveOrderPackaging,
    (order, packaging): ActiveOrderDetails => ({
      cargoType: order?.cargoType || null,
      documents: order?.cargoType === CargoType.DOCUMENTS ? getDocuments(order.documents) : null,
      parcels: order?.cargoType === CargoType.PARCELS ? getParcels(order.parcels) : null,
      autoParts: order?.cargoType === CargoType.AUTO_PARTS ? getAutoParts(order.autoParts) : null,
      otherCargo: order?.cargoType === CargoType.OTHER ? getOtherCargo(order.otherCargo) : null,
      packaging,
      additionalServices: order?.additionalServices || null,
    }),
  );

  const selectOrderReviewDetails = createSelector(
    selectActiveOrder,
    selectActiveOrderPackaging,
    (order, packaging): OrderReviewDetails => ({
      cargoType: order?.cargoType || null,
      documents: order?.cargoType === CargoType.DOCUMENTS ? getDocuments(order.documents) : null,
      parcels: order?.cargoType === CargoType.PARCELS && order.parcels ? order.parcels.items : null,
      autoParts:
        order?.cargoType === CargoType.AUTO_PARTS && order.autoParts ? order.autoParts.items : null,
      otherCargo: order?.cargoType === CargoType.OTHER ? getOtherCargo(order.otherCargo) : null,
      packaging,
      additionalServices: order?.additionalServices || null,
    }),
  );

  return {
    selectActiveOrder,
    selectIsActiveOrderValid,
    selectIsAllOrdersValid,
    selectEnhancedOrders,
    selectCargoTypes,
    selectAutoPartsOptions,
    selectOtherCargosOptions,
    selectAdditionalServicesOptions,
    selectPackagingOptions,
    selectActiveOrderDetails,
    selectOrderReviewDetails,
  };
};
