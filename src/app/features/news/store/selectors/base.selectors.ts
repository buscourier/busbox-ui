import { createSelector, type MemoizedSelector } from '@ngrx/store';

import type { NewsState } from '../state';

import type { BaseSelectors } from './base-selectors.types';

type NewsStateSelector = MemoizedSelector<object, NewsState>;

export const createBaseSelectors = (selectNewsState: NewsStateSelector): BaseSelectors => {
  const selectNewsListState = createSelector(selectNewsState, (news) => news.list);
  const selectNewsDetailsState = createSelector(selectNewsState, (news) => news.details);

  return {
    selectNewsListStatus: createSelector(selectNewsListState, (list) => list.status),
    selectNewsList: createSelector(selectNewsListState, (list) => list.data || []),
    selectNewsListError: createSelector(selectNewsListState, (list) => list.error),

    selectNewsDetailsStatus: createSelector(selectNewsDetailsState, (details) => details.status),
    selectNewsDetails: createSelector(selectNewsDetailsState, (details) => details.data),
    selectNewsDetailsError: createSelector(selectNewsDetailsState, (details) => details.error),
  };
};
