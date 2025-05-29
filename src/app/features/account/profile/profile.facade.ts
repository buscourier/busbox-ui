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

  loadFields(userId: string): void {
    this.store.dispatch(ProfileActions.getFields({ userId }));
  }

  updateFields(userId: string, payload: unknown) {
    this.store.dispatch(ProfileActions.updateFields({ userId, payload }));
  }

  loadConfidants(userId: string): void {
    this.store.dispatch(ProfileActions.getConfidants({ userId }));
  }

  loadAll(userId: string) {
    this.loadFields(userId);
    this.loadConfidants(userId);
  }
}
