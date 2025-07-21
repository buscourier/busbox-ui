import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type { NewsDetails, NewsItem } from '../types';

export const NewsActions = createActionGroup({
  source: 'News',
  events: {
    'Load News': emptyProps(),
    'Load News Success': props<{ news: NewsItem[] }>(),
    'Load News Failure': props<{ error: ApiError }>(),

    'Load News Details': props<{ id: string }>(),
    'Load News Details Success': props<{ details: NewsDetails }>(),
    'Load News Details Failure': props<{ error: ApiError }>(),
  },
});
