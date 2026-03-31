import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  AuthActions,
  selectError,
  selectIsAuthenticated,
  selectIsInitialized,
  selectIsLoading,
  selectUser,
} from './store';
import type { LoginCredentials, RegisterPayload } from './types';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly store = inject(Store);

  readonly isLoading$ = this.store.select(selectIsLoading);
  readonly isAuthenticated$ = this.store.select(selectIsAuthenticated);
  readonly isInitialized$ = this.store.select(selectIsInitialized);
  readonly currentUser$ = this.store.select(selectUser);
  readonly error$ = this.store.select(selectError);

  login(credentials: LoginCredentials): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  register(userData: RegisterPayload): void {
    this.store.dispatch(AuthActions.register({ userData }));
  }

  forgotPassword(email: string): void {
    this.store.dispatch(AuthActions.forgotPassword({ email }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }
}
