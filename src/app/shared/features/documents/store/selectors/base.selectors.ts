import { createSelector, type MemoizedSelector } from '@ngrx/store';

import type { DocumentsState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type DocumentsStateSelector = MemoizedSelector<object, DocumentsState>;

export const createBaseSelectors = (
  selectDocumentsState: DocumentsStateSelector,
): BaseSelectors => {
  return {
    selectDocumentsStatus: createSelector(selectDocumentsState, (documents) => documents.status),
    selectDocuments: createSelector(selectDocumentsState, (documents) => documents.data),
    selectDocumentsError: createSelector(selectDocumentsState, (documents) => documents.error),
  };
};
