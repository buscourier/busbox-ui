import { Injectable } from '@angular/core';
import { catchError, type Observable } from 'rxjs';

import { ApiService } from '@core/services/api.service';

import type { DocumentFile } from '@shared/types';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService extends ApiService {
  private readonly documentsUrl = `${this.baseUrl}/site/documents`;

  getDocuments(): Observable<DocumentFile[]> {
    return this.http
      .get<DocumentFile[]>(this.documentsUrl)
      .pipe(catchError(this.handleError.bind(this)));
  }
}
