import { createSelector } from '@ngrx/store';

import type { Office, PickupCity } from '@shared/types';
import { FormControlStatus } from '@shared/types';

import { LIMITED_OFFICE } from '@delivery/constants';
import type { Courier, ErrorStatus, ReviewSection } from '@delivery/types';
import { getDeliveryMethod } from '@delivery/utils';

import { PICKUP_POINT_TABS } from '../../constants';
import { PickupPointTabType } from '../../types';
import type { PickupPointTab } from '../../types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  /**
   * Returns offices filtered by selected city ID.
   * Returns empty array if no city is selected.
   */
  const selectAvailableOffices = createSelector(
    [baseSelectors.selectOffices, baseSelectors.selectSelectedCity],
    (offices: Office[], selectedCity: PickupCity | null): Office[] => {
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

  const selectTabs = createSelector(
    selectAvailableOffices,
    (offices: Office[]): PickupPointTab[] => {
      if (!offices?.length) return [];

      return PICKUP_POINT_TABS.filter((tab) =>
        offices.some((office) => office[tab.apiValue] === '1'),
      ).sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  );

  const selectActiveTab = createSelector(
    baseSelectors.selectActiveTabId,
    selectTabs,
    (
      activeTabId: PickupPointTabType | null,
      availableTabs: PickupPointTab[],
    ): PickupPointTab | null => {
      if (!activeTabId && !availableTabs.length) return null;

      return availableTabs.find((tab) => tab.id === activeTabId) || null;
    },
  );

  const selectIsCourierSelected = createSelector(
    baseSelectors.selectActiveTabId,
    (activeTabId: string | null): boolean => {
      if (!activeTabId) return false;

      return activeTabId === PickupPointTabType.COURIER;
    },
  );

  const selectCourier = createSelector(
    selectIsCourierSelected,
    baseSelectors.selectCourierDetails,
    (isCourierSelected, courierDetails): Courier | null => {
      if (!isCourierSelected || !courierDetails) return null;

      return {
        id: '1',
        details: courierDetails,
      };
    },
  );

  const selectActiveTabName = createSelector(selectActiveTab, (activeTab) =>
    activeTab ? activeTab.name : '',
  );

  const selectFormControlStatus = createSelector(baseSelectors.selectForm, (state) => ({
    valid: state.status === FormControlStatus.VALID,
    invalid: state.status === FormControlStatus.INVALID,
    disabled: state.status === FormControlStatus.DISABLED,
    pending: state.status === FormControlStatus.PENDING,
  }));

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

  const selectIsPickupLimited = createSelector(
    selectIsOfficeLimited,
    selectIsCourierSelected,
    (isOfficeLimited, isCourierSelected): boolean => isOfficeLimited || isCourierSelected,
  );

  const selectReviewSection = createSelector(
    baseSelectors.selectSelectedCity,
    baseSelectors.selectSelectedOffice,
    baseSelectors.selectCourierDetails,
    baseSelectors.selectDepartureDate,
    (city, office, courier, date): ReviewSection => {
      return {
        title: 'pickupPoint.title.booking',
        fields: [
          { label: 'pickupPoint.labels.city', value: city?.name || 'text.noData' },
          { label: 'pickupPoint.labels.departureDate', value: date || 'text.noData' },
          getDeliveryMethod(office, courier),
        ],
      };
    },
  );

  const selectIsPickupPointValid = createSelector(selectFormState, (form) => form.valid);

  const selectIsPickupPointComplete = createSelector(
    baseSelectors.selectSelectedCity,
    baseSelectors.selectSelectedOffice,
    selectIsCourierSelected,
    baseSelectors.selectCourierDetails,
    (city, office, isCourierSelected, courierDetails) => {
      if (!city?.id) return false;

      const isCourierDetailsComplete =
        !!courierDetails &&
        !!courierDetails.apartment &&
        !!courierDetails.building &&
        !!courierDetails.street;

      return isCourierSelected ? isCourierDetailsComplete : !!office;
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
    selectIsPickupLimited,
    selectReviewSection,
    selectIsPickupPointValid,
    selectIsPickupPointComplete,
  };
};
