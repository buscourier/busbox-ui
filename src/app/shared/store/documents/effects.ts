import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { TuiAlertService } from '@taiga-ui/core';
import { switchMap } from 'rxjs';

import { DocumentsService } from '@core/services/api';

import type { ApiError } from '@shared/types';

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
    (
      actions$ = inject(Actions),
      alert = inject(TuiAlertService),
      transloco = inject(TranslocoService),
    ) => {
      return actions$.pipe(
        ofType(DocumentsActions.loadDocumentsFailure),
        switchMap(({ error }) => {
          const message = error?.message || 'Не удалось загрузить документы';

          return alert.open(message, {
            label: transloco.translate('alert.labels.error'),
            autoClose: 0,
            appearance: 'error',
          });
        }),
      );
    },
    { functional: true, dispatch: false },
  ),
};
