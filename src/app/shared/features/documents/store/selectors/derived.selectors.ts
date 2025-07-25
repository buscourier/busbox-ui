import { createSelector } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const selectIsDocumentsLoading = createSelector(
    baseSelectors.selectDocumentsStatus,
    (status) => status === AsyncStatus.LOADING,
  );

  const selectIsDocumentsLoaded = createSelector(
    baseSelectors.selectDocumentsStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectIsDocumentsError = createSelector(
    baseSelectors.selectDocumentsStatus,
    (status) => status === AsyncStatus.LOADED,
  );

  const selectHasDocuments = createSelector(
    baseSelectors.selectDocuments,
    selectIsDocumentsLoaded,
    (data, isLoaded) => isLoaded && !!data,
  );

  const selectDocumentByType = (charcode: string) =>
    createSelector(
      baseSelectors.selectDocuments,
      (documents) => documents?.find((document) => document.charcode === charcode) || null,
    );

  return {
    selectIsDocumentsLoading,
    selectIsDocumentsLoaded,
    selectIsDocumentsError,
    selectHasDocuments,
    selectDocumentByType,
    selectRules: selectDocumentByType('rules'),
    selectContract: selectDocumentByType('dogovor'),
    selectWarrantIndividual: selectDocumentByType('warrant_fiz'),
    selectWarrantLegal: selectDocumentByType('warrant_ur'),
    selectPackaging: selectDocumentByType('upakovka'),
    selectTariffs: selectDocumentByType('tarif'),
    selectCourierTariff: selectDocumentByType('tarif_kurier'),
    selectWorkConditionsAssessment: selectDocumentByType('spec_otcenka'),
  };
};
