import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import type { PickupCity } from '@shared/types';

import { TariffsActions, tariffsFeature } from './store';
import type { TariffsViewModel } from './types';

@Injectable({
  providedIn: 'root',
})
export class TariffsFacade {
  private readonly store = inject(Store);

  getViewModel(): Observable<TariffsViewModel> {
    return this.store.select(tariffsFeature.selectViewModel);
  }

  loadAllData(cityId: string): void {
    this.loadZones(cityId);
    this.loadZoneTariffs(cityId);
  }

  loadZones(cityId: string): void {
    this.store.dispatch(TariffsActions.loadZones({ cityId }));
  }

  loadZoneTariffs(cityId: string): void {
    this.store.dispatch(TariffsActions.loadZoneTariffs({ cityId }));
  }

  selectCity(city: PickupCity) {
    this.store.dispatch(TariffsActions.selectCity({ city }));
  }
}
