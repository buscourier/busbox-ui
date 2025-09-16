import { createSelector } from '@ngrx/store';

import type { DeliveryCity, Office } from '@shared/types';
import { isNonEmpty } from '@shared/utils';

import { LIMITED_OFFICE } from '@delivery/constants';
import type { Courier, ErrorStatus, ReviewSection } from '@delivery/types';
import { getDeliveryMethod } from '@delivery/utils';

import { DELIVERY_POINT_TABS } from '../../constants';
import type { DeliveryPointTab } from '../../types';
import { DeliveryPointTabType } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  /**
   * Returns offices filtered by selected city ID.
   * Returns empty array if no city is selected.
   */
  const selectAvailableOffices = createSelector(
    [baseSelectors.selectOffices, baseSelectors.selectSelectedCity],
    (offices: Office[], selectedCity: DeliveryCity | null): Office[] => {
      if (!selectedCity) {
        return [];
      }

      return offices.filter((office) => office.office_id === selectedCity.office_id);
    },
  );

  const selectIsOfficeLimited = createSelector(
    baseSelectors.selectSelectedOffice,
    (selectedOffice: Office | null): boolean => {
      if (!selectedOffice) return false;

      return [LIMITED_OFFICE.ALEUTSKAYA, LIMITED_OFFICE.GOGOLYA].includes(selectedOffice.home_id);
    },
  );

  const selectOfficeTabs = createSelector(
    selectAvailableOffices,
    (offices: Office[]): DeliveryPointTab[] => {
      if (!offices?.length) return [];

      return DELIVERY_POINT_TABS.filter((tab) =>
        // Using type assertion because we know these apiValues exist in Office
        // Only 'get' and 'delivery' are checked here
        offices.some((office) => office[tab.apiValue as keyof Office] === '1'),
      ).sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  );

  const selectBusPickupTab = createSelector(
    baseSelectors.selectSelectedCity,
    (selectedCity: DeliveryCity | null): DeliveryPointTab | null => {
      if (!selectedCity?.need_to_meet || selectedCity.need_to_meet !== '1') {
        return null;
      }

      return DELIVERY_POINT_TABS.find((tab) => tab.apiValue === 'need_to_meet') ?? null;
    },
  );

  const selectTabs = createSelector(
    selectOfficeTabs,
    selectBusPickupTab,
    (officeTabs, needToMeetTab): DeliveryPointTab[] => {
      if (needToMeetTab) {
        return [...officeTabs, needToMeetTab];
      }
      return officeTabs;
    },
  );

  const selectActiveTab = createSelector(
    baseSelectors.selectActiveTabId,
    selectTabs,
    (
      activeTabId: DeliveryPointTabType | null,
      availableTabs: DeliveryPointTab[],
    ): DeliveryPointTab | null => {
      if (!activeTabId || !availableTabs.length) return null;

      return availableTabs.find((tab) => tab.id === activeTabId) || null;
    },
  );

  const selectIsCourierSelected = createSelector(
    baseSelectors.selectActiveTabId,
    (activeTabId: string | null): boolean => {
      if (!activeTabId) return false;

      return activeTabId === DeliveryPointTabType.COURIER;
    },
  );

  const selectIsBusSelected = createSelector(
    baseSelectors.selectActiveTabId,
    (activeTabId: string | null): boolean => {
      if (!activeTabId) return false;

      return activeTabId === DeliveryPointTabType.BUS;
    },
  );

  const selectCourier = createSelector(
    selectIsCourierSelected,
    baseSelectors.selectCourierDetails,
    (isCourierSelected, courierDetails): Courier | null => {
      if (!isCourierSelected || !courierDetails) return null;

      return {
        id: '2',
        details: courierDetails,
      };
    },
  );

  const selectActiveTabName = createSelector(selectActiveTab, (activeTab) =>
    activeTab ? activeTab.name : '',
  );

  const selectFormControlStatus = createSelector(
    baseSelectors.selectIsFormValid,
    baseSelectors.selectIsFormInvalid,
    baseSelectors.selectIsFormDisabled,
    baseSelectors.selectIsFormPending,
    (valid, invalid, disabled, pending) => ({
      valid,
      invalid,
      disabled,
      pending,
    }),
  );

  const selectFormState = createSelector(
    baseSelectors.selectForm,
    selectFormControlStatus,
    (form, status) => ({
      ...status,
      dirty: form.dirty,
      touched: form.touched,
      pristine: form.pristine,
    }),
  );

  const selectErrorStatus = createSelector(
    baseSelectors.selectCitiesError,
    baseSelectors.selectOfficesError,
    (citiesError, officesError): ErrorStatus => ({
      citiesError,
      officesError,
      hasAnyError: !!citiesError || !!officesError,
    }),
  );

  const selectIsDeliveryLimited = createSelector(
    selectIsOfficeLimited,
    selectIsCourierSelected,
    (isOfficeLimited, isCourierSelected): boolean => isOfficeLimited || isCourierSelected,
  );

  const selectReviewSection = createSelector(
    baseSelectors.selectSelectedCity,
    baseSelectors.selectSelectedOffice,
    baseSelectors.selectCourierDetails,
    baseSelectors.selectBusPickup,
    (city, office, courier, busPickup): ReviewSection => ({
      title: 'deliveryPoint.title.booking',
      fields: [
        { label: 'deliveryPoint.labels.city', value: city?.name || 'text.noData' },
        getDeliveryMethod(office, courier, busPickup),
      ],
    }),
  );

  const selectIsDeliveryPointValid = createSelector(selectFormState, (form) => form.valid);

  const selectIsDeliveryPointComplete = createSelector(
    baseSelectors.selectSelectedCity,
    baseSelectors.selectSelectedOffice,
    selectIsCourierSelected,
    selectIsBusSelected,
    baseSelectors.selectCourierDetails,
    (city, office, isCourierSelected, isBusSelected, courierDetails) => {
      if (!city?.id) return false;

      const isCourierDetailsComplete =
        !!courierDetails &&
        isNonEmpty(courierDetails.apartment) &&
        isNonEmpty(courierDetails.building) &&
        isNonEmpty(courierDetails.street);

      if (isCourierSelected) {
        return isCourierDetailsComplete;
      }

      return isBusSelected || !!office?.id;
    },
  );

  return {
    selectAvailableOffices,
    selectIsOfficeLimited,
    selectTabs,
    selectActiveTab,
    selectIsCourierSelected,
    selectCourier,
    selectActiveTabName,
    selectFormState,
    selectErrorStatus,
    selectIsDeliveryLimited,
    selectReviewSection,
    selectIsDeliveryPointValid,
    selectIsDeliveryPointComplete,
  };
};
