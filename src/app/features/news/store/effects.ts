import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { TuiAlertService } from '@taiga-ui/core';
import { switchMap } from 'rxjs';

import { ModalService } from '@core/services/modal.service';

import type { ApiError } from '@shared/types';

import { NewsService } from '../services';

import { NewsActions } from './actions';

export const NewsEffects = {
  loadNews: createEffect(
    (actions$ = inject(Actions), newsService = inject(NewsService)) => {
      return actions$.pipe(
        ofType(NewsActions.loadNews),
        switchMap(() =>
          newsService.getNews().pipe(
            mapResponse({
              next: (news) => NewsActions.loadNewsSuccess({ news }),
              error: (error: ApiError) => NewsActions.loadNewsFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),

  loadNewsDetails: createEffect(
    (actions$ = inject(Actions), newsService = inject(NewsService)) => {
      return actions$.pipe(
        ofType(NewsActions.loadNewsDetails),
        switchMap(({ id }) =>
          newsService.getNewsDetails(id).pipe(
            mapResponse({
              next: (details) => NewsActions.loadNewsDetailsSuccess({ details }),
              error: (error: ApiError) => NewsActions.loadNewsDetailsFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),

  errorHandling: createEffect(
    (
      actions$ = inject(Actions),
      modalService = inject(ModalService),
      alert = inject(TuiAlertService),
      transloco = inject(TranslocoService),
    ) => {
      return actions$.pipe(
        ofType(NewsActions.loadNewsFailure, NewsActions.loadNewsDetailsFailure),
        switchMap((action) => {
          let message = '';

          switch (action.type) {
            case NewsActions.loadNewsFailure.type:
              message = 'Не удалось загрузить новости';
              break;

            case NewsActions.loadNewsDetailsFailure.type:
              message = 'Не удалось загрузить новость';
              modalService.closeAllModals();
              break;
          }

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
