import type { NewsDetails, NewsItem } from './news.types';

export interface NewsListViewModel {
  isLoading: boolean;
  hasData: boolean;
  data: NewsItem[];
}

export interface NewsDetailsViewModel {
  isLoading: boolean;
  hasData: boolean;
  data: NewsDetails | null;
}

export interface NewsViewModel {
  list: NewsListViewModel;
  details: NewsDetailsViewModel;
}
