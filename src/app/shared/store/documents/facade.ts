import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import type { DocumentFile } from '@shared/types';

import { DocumentsActions } from './actions';
import { documentsFeature } from './feature';

@Injectable({
  providedIn: 'root',
})
export class DocumentsFacade {
  private readonly store = inject(Store);

  isDocumentsLoading(): Observable<boolean> {
    return this.store.select(documentsFeature.selectIsDocumentsLoading);
  }

  isDocumentsLoaded(): Observable<boolean> {
    return this.store.select(documentsFeature.selectIsDocumentsLoaded);
  }

  getDocuments(): Observable<DocumentFile[]> {
    return this.store.select(documentsFeature.selectDocuments);
  }

  getRules(): Observable<DocumentFile | null> {
    return this.store.select(documentsFeature.selectRules);
  }

  getContract(): Observable<DocumentFile | null> {
    return this.store.select(documentsFeature.selectContract);
  }

  getWarrantIndividual(): Observable<DocumentFile | null> {
    return this.store.select(documentsFeature.selectWarrantIndividual);
  }

  getWarrantLegal(): Observable<DocumentFile | null> {
    return this.store.select(documentsFeature.selectWarrantLegal);
  }

  getPackaging(): Observable<DocumentFile | null> {
    return this.store.select(documentsFeature.selectPackaging);
  }

  getTariffs(): Observable<DocumentFile | null> {
    return this.store.select(documentsFeature.selectTariffs);
  }

  getCourierTariff(): Observable<DocumentFile | null> {
    return this.store.select(documentsFeature.selectCourierTariff);
  }

  getWorkConditionsAssessment(): Observable<DocumentFile | null> {
    return this.store.select(documentsFeature.selectWorkConditionsAssessment);
  }

  loadDocuments(): void {
    this.store.dispatch(DocumentsActions.loadDocuments());
  }
}
