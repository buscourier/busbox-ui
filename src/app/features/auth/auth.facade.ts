import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';

import type { ApiError } from '@shared/types';

import {
  AuthActions,
  selectError,
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from './store';
import type { AuthResponse, LoginCredentials, RegisterPayload } from './types';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly store = inject(Store);

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

  isLoading(): Observable<boolean> {
    return this.store.select(selectIsLoading);
  }

  isAuthenticated(): Observable<boolean> {
    return this.store.select(selectIsAuthenticated);
  }

  loadCurrentUser(): void {
    this.store.dispatch(AuthActions.getCurrentUser());
  }

  getCurrentUser(): Observable<AuthResponse | null> {
    return this.store.select(selectUser);
  }

  getError(): Observable<ApiError | null> {
    return this.store.select(selectError);
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }
}
