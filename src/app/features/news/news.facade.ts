import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { NewsActions, newsFeature } from './store';
import type { NewsViewModel } from './types';

@Injectable({
  providedIn: 'root',
})
export class NewsFacade {
  private readonly store = inject(Store);

  getViewModel(): Observable<NewsViewModel> {
    return this.store.select(newsFeature.selectViewModel);
  }

  loadNews(): void {
    this.store.dispatch(NewsActions.loadNews());
  }

  loadNewsDetails(id: string): void {
    this.store.dispatch(NewsActions.loadNewsDetails({ id }));
  }
}
