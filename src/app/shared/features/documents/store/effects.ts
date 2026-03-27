import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificationsActions } from '@core/notifications';

import type { ApiError } from '@shared/types';

import { DocumentsService } from '../services';

import { DocumentsActions } from './actions';

export const DocumentsEffects = {
  loadDocuments: createEffect(
    (actions$ = inject(Actions), documentsService = inject(DocumentsService)) => {
      return actions$.pipe(
        ofType(DocumentsActions.loadDocuments),
        switchMap(() =>
          documentsService.getDocuments().pipe(
            mapResponse({
              next: (data) => DocumentsActions.loadDocumentsSuccess({ data }),
              error: (error: ApiError) => DocumentsActions.loadDocumentsFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),

  onLoadFailure: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(DocumentsActions.loadDocumentsFailure),
        map(() =>
          NotificationsActions.showError({
            message: 'Не удалось загрузить документы',
          }),
        ),
      );
    },
    { functional: true },
  ),
};
