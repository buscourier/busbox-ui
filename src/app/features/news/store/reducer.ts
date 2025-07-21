import { createReducer, on } from '@ngrx/store';

import { LoadingStatus } from '@shared/types';

import { NewsActions } from './actions';
import { initialState, type NewsState } from './state';

export const newsReducer = createReducer(
  initialState,
  on(
    NewsActions.loadNews,
    (state): NewsState => ({
      ...state,
      list: {
        ...state.list,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    NewsActions.loadNewsSuccess,
    (state, { news }): NewsState => ({
      ...state,
      list: {
        ...state.list,
        status: LoadingStatus.LOADED,
        data: news,
      },
    }),
  ),
  on(
    NewsActions.loadNewsFailure,
    (state, { error }): NewsState => ({
      ...state,
      list: {
        ...state.list,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),

  on(
    NewsActions.loadNewsDetails,
    (state): NewsState => ({
      ...state,
      details: {
        ...state.details,
        status: LoadingStatus.LOADING,
        error: null,
      },
    }),
  ),
  on(
    NewsActions.loadNewsDetailsSuccess,
    (state, { details }): NewsState => ({
      ...state,
      details: {
        ...state.details,
        status: LoadingStatus.LOADED,
        data: details,
      },
    }),
  ),
  on(
    NewsActions.loadNewsDetailsFailure,
    (state, { error }): NewsState => ({
      ...state,
      details: {
        ...state.details,
        status: LoadingStatus.ERROR,
        error,
      },
    }),
  ),
);
