import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, type Observable, take } from 'rxjs';

import { NewsActions, newsFeature } from './store';
import type { NewsItem, NewsViewModel } from './types';

@Injectable({
  providedIn: 'root',
})
export class NewsFacade {
  private readonly store = inject(Store);

  getViewModel(): Observable<NewsViewModel> {
    return this.store.select(newsFeature.selectViewModel);
  }

  getLatestNews(): Observable<NewsItem[]> {
    // return this.store.select(newsFeature.selectNewsList).pipe(map((news) => news.slice(0, 3)));
    return this.store.select(newsFeature.selectNewsList);
  }

  loadNews(): void {
    this.store
      .select(newsFeature.selectNewsList)
      .pipe(
        take(1),
        filter((news) => news.length === 0),
      )
      .subscribe(() => {
        this.store.dispatch(NewsActions.loadNews());
      });
  }

  loadNewsDetails(id: string): void {
    this.store.dispatch(NewsActions.loadNewsDetails({ id }));
  }
}
