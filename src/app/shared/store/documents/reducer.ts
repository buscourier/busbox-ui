import { createReducer, on } from '@ngrx/store';

import { AsyncStatus } from '@shared/types';

import { DocumentsActions } from './actions';
import type { DocumentsState } from './state';
import { initialState } from './state';

export const documentsReducer = createReducer(
  initialState,
  on(
    DocumentsActions.loadDocuments,
    (state): DocumentsState => ({
      ...state,
      status: AsyncStatus.LOADING,
      error: null,
    }),
  ),
  on(
    DocumentsActions.loadDocumentsSuccess,
    (state, { data }): DocumentsState => ({
      ...state,
      status: AsyncStatus.LOADED,
      data,
    }),
  ),
  on(
    DocumentsActions.loadDocumentsFailure,
    (state, { error }): DocumentsState => ({
      ...state,
      status: AsyncStatus.ERROR,
      error,
    }),
  ),
);
