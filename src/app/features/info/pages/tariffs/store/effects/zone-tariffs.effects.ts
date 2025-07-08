import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { TariffsService } from '../../services';

import { TariffsActions } from '../actions';

export const zoneTariffsEffects = {
  loadZoneTariffs: createEffect(
    (actions$ = inject(Actions), tariffsService = inject(TariffsService)) => {
      return actions$.pipe(
        ofType(TariffsActions.loadZoneTariffs),
        switchMap(({ cityId }) =>
          tariffsService.getZoneTariffs(cityId).pipe(
            mapResponse({
              next: (data) => TariffsActions.loadZoneTariffsSuccess({ data }),
              error: (error: ApiError) => TariffsActions.loadZoneTariffsFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
