import { createSelector } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import type { BaseSelectors } from './base-selectors.types';
import type { DerivedSelectors } from './derived-selectors.types';

export const createDerivedSelectors = (baseSelectors: BaseSelectors): DerivedSelectors => {
  const createDocumentSelector = (charcode: string) =>
    createSelector(
      baseSelectors.selectDocuments,
      (documents) => documents?.find((document) => document.charcode === charcode) || null,
    );

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

  return {
    selectIsDocumentsLoading,
    selectIsDocumentsLoaded,
    selectIsDocumentsError,
    selectHasDocuments,
    selectRules: createDocumentSelector('rules'),
    selectContract: createDocumentSelector('dogovor'),
    selectWarrantIndividual: createDocumentSelector('warrant_fiz'),
    selectWarrantLegal: createDocumentSelector('warrant_ur'),
    selectPackaging: createDocumentSelector('upakovka'),
    selectTariffs: createDocumentSelector('tarif'),
    selectCourierTariff: createDocumentSelector('tarif_kurier'),
    selectWorkConditionsAssessment: createDocumentSelector('spec_otcenka'),
  };
};
