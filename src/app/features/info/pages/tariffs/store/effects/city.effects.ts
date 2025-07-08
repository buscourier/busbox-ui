import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { TariffsActions } from '../actions';

export const cityEffects = {
  loadZonesOnCitySelection: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(TariffsActions.selectCity),
        map(({ city }) => TariffsActions.loadZones({ cityId: city.site_id })),
      );
    },
    { functional: true },
  ),

  loadTariffsOnCitySelection: createEffect(
    (actions$ = inject(Actions)) => {
      return actions$.pipe(
        ofType(TariffsActions.selectCity),
        map(({ city }) => TariffsActions.loadZoneTariffs({ cityId: city.site_id })),
      );
    },
    { functional: true },
  ),
};
