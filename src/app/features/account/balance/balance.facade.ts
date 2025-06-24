import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { BalanceActions, balanceFeature } from './store';
import type { BalanceViewModel } from './types';

@Injectable({
  providedIn: 'root',
})
export class BalanceFacade {
  private readonly store = inject(Store);

  getViewModel(): Observable<BalanceViewModel> {
    return this.store.select(balanceFeature.selectViewModel);
  }

  loadSummary(): void {
    this.store.dispatch(BalanceActions.loadSummary());
  }
}
