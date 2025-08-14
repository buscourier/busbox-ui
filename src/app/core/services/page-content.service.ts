import { Injectable } from '@angular/core';
import { catchError, type Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@core/services/api.service';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PageContentService extends ApiService {
  privacyPolicy$: Observable<string> | null = null;

  private readonly pageUrl = `${this.baseUrl}/site/page/${environment.apiKey}`;

  getPrivacyPolicy(): Observable<string> {
    if (!this.privacyPolicy$) {
      this.privacyPolicy$ = this.http
        .get<string>(`${this.pageUrl}/53`)
        .pipe(
          map(this.validatePageResponse.bind(this)),
          catchError(this.handleError.bind(this)),
          shareReplay(1),
        );
    }
    return this.privacyPolicy$;
  }

  private validatePageResponse(content: string): string {
    if (!content?.trim() || content.toLowerCase().includes("can't find page")) {
      throw new Error('Данные страницы не загружены');
    }
    return content;
  }
}
