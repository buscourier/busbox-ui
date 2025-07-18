import { type AsyncState, AsyncStatus } from '@shared/types';

import type { NewsDetails, NewsItem } from '../types';

export interface NewsState {
  list: AsyncState<NewsItem[]>;
  details: AsyncState<NewsDetails>;
}

export const initialState: NewsState = {
  list: {
    status: AsyncStatus.IDLE,
    data: [],
    error: null,
  },
  details: {
    status: AsyncStatus.IDLE,
    data: null,
    error: null,
  },
};
