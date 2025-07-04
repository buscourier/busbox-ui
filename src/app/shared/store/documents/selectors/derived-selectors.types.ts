import type { MemoizedSelector } from '@ngrx/store';

import type { DocumentFile } from '@shared/types';

export interface DerivedSelectors {
  selectIsDocumentsLoading: MemoizedSelector<object, boolean>;
  selectIsDocumentsLoaded: MemoizedSelector<object, boolean>;
  selectIsDocumentsError: MemoizedSelector<object, boolean>;
  selectHasDocuments: MemoizedSelector<object, boolean>;
  selectRules: MemoizedSelector<object, DocumentFile | null>;
  selectContract: MemoizedSelector<object, DocumentFile | null>;
  selectWarrantIndividual: MemoizedSelector<object, DocumentFile | null>;
  selectWarrantLegal: MemoizedSelector<object, DocumentFile | null>;
  selectPackaging: MemoizedSelector<object, DocumentFile | null>;
  selectTariffs: MemoizedSelector<object, DocumentFile | null>;
  selectCourierTariff: MemoizedSelector<object, DocumentFile | null>;
  selectWorkConditionsAssessment: MemoizedSelector<object, DocumentFile | null>;
}
