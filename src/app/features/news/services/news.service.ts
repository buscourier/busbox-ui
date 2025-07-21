import { Injectable } from '@angular/core';
import { catchError, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@core/services';

import type { NewsDetails, NewsItem } from '../types';

@Injectable({
  providedIn: 'root',
})
export class NewsService extends ApiService {
  private readonly newsUrl = `${this.baseUrl}/site/news`;

  getNews(): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>(this.newsUrl).pipe(catchError(this.handleError.bind(this)));
  }

  getNewsDetails(id: string): Observable<NewsDetails> {
    return this.http.get<NewsDetails[]>(`${this.newsUrl}/${id}`).pipe(
      map((data) => data[0]),
      catchError(this.handleError.bind(this)),
    );
  }
}
