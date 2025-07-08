import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';

import type { ApiError } from '@shared/types';

import { TariffsService } from '../../services';

import { TariffsActions } from '../actions';

export const zonesEffects = {
  loadZones: createEffect(
    (actions$ = inject(Actions), tariffsService = inject(TariffsService)) => {
      return actions$.pipe(
        ofType(TariffsActions.loadZones),
        switchMap(({ cityId }) =>
          tariffsService.getZones(cityId).pipe(
            mapResponse({
              next: (data) => TariffsActions.loadZonesSuccess({ data }),
              error: (error: ApiError) => TariffsActions.loadZonesFailure({ error }),
            }),
          ),
        ),
      );
    },
    { functional: true },
  ),
};
