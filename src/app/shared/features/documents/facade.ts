import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { type Observable, of, switchMap, take, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';

import { AsyncStatus } from '@shared/types';

import { DocumentsActions, documentsFeature } from './store';
import type { DocumentCategory, DocumentFile } from './types';

@Injectable({
  providedIn: 'root',
})
export class DocumentsFacade {
  private readonly store = inject(Store);

  readonly status$ = this.store
    .select(documentsFeature.selectDocumentsStatus)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly documents$ = this.store
    .select(documentsFeature.selectDocuments)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly isLoading$ = this.store.select(documentsFeature.selectIsDocumentsLoading);
  readonly isLoaded$ = this.store.select(documentsFeature.selectIsDocumentsLoaded);

  getDocuments(): Observable<DocumentFile[]> {
    return this.status$.pipe(
      switchMap((status) => {
        if (status === AsyncStatus.IDLE) {
          this.loadDocuments();
        }
        return this.documents$; // ← Используем кешированный поток
      }),
    );
  }

  getDocumentByType(type: string): Observable<DocumentFile | null> {
    return this.getDocuments().pipe(
      map((documents) => documents.find((doc) => doc.charcode === type) || null),
    );
  }

  getDocumentsByTypes(types: DocumentCategory[]): Observable<DocumentFile[]> {
    if (!types || types.length === 0) {
      return of([]);
    }

    return this.getDocuments().pipe(
      map((documents) =>
        documents.filter((doc) => types.includes(doc.charcode as DocumentCategory)),
      ),
    );
  }

  loadDocuments(): void {
    this.status$.pipe(take(1)).subscribe((status) => {
      if (status === AsyncStatus.IDLE || status === AsyncStatus.ERROR) {
        this.store.dispatch(DocumentsActions.loadDocuments());
      }
    });
  }
}
