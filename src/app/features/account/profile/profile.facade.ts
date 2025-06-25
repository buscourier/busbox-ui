import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import { ProfileActions, profileFeature } from './store';
import type { ProfileViewModel } from './types';

@Injectable({
  providedIn: 'root',
})
export class ProfileFacade {
  private readonly store = inject(Store);

  getViewModel(): Observable<ProfileViewModel> {
    return this.store.select(profileFeature.selectViewModel);
  }

  loadFields(): void {
    this.store.dispatch(ProfileActions.loadFields());
  }

  updateFields(payload: unknown) {
    this.store.dispatch(ProfileActions.updateFields({ payload }));
  }

  loadConfidants(): void {
    this.store.dispatch(ProfileActions.loadConfidants());
  }

  loadAll() {
    this.loadFields();
    this.loadConfidants();
  }
}
