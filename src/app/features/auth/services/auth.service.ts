import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, type Observable, of, tap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';

import type {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiBaseUrl}/account/login`,
        JSON.stringify({
          'api-key': environment.apiKey,
          ...credentials,
        }),
      )
      .pipe(catchError((error) => this.handleError('Login Failed', error)));
  }

  register(userData: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/users`, userData).pipe(
      tap((response) => this.handleAuthentication(response)),
      catchError((error) => this.handleError('Registration Failed', error)),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/account/logout`, {}).pipe(
      tap(() => this.handleLogout()),
      catchError(() => {
        this.handleLogout();
        return of(void 0);
      }),
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiBaseUrl}/account/forgot-password`, { email })
      .pipe(catchError((error) => this.handleError('Forgot password request failed', error)));
  }

  resetPassword(payload: ResetPasswordPayload): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiBaseUrl}/reset-password`, payload)
      .pipe(catchError((error) => this.handleError('Password reset failed', error)));
  }

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  getCurrentUser(accessToken: string): Observable<AuthResponse | null> {
    if (!this.isAuthenticated()) {
      return of(null);
    }

    return this.http
      .get<AuthResponse>(`${environment.apiBaseUrl}/account/auth/${accessToken}`)
      .pipe(
        catchError(() => {
          this.handleLogout();
          return of(null);
        }),
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<AuthResponse>(`${this.apiBaseUrl}/refresh-token`, { refresh_token: refreshToken })
      .pipe(
        map((response) => {
          if ('error' in response) {
            const errorMessage =
              typeof response.error === 'string' ? response.error : 'Unknown error';

            throw new Error(errorMessage);
          }
          return response as AuthResponse;
        }),
        tap((response) => this.handleAuthentication(response)),
        catchError((error) => {
          this.handleLogout();
          return this.handleError('Token refresh failed', error);
        }),
      );
  }

  private handleAuthentication(response: AuthResponse): void {
    this.tokenService.setTokens(response.auth_key);
  }

  private handleLogout(): void {
    this.tokenService.clearTokens();
  }

  private handleError(message: string, error: string): Observable<never> {
    console.error(`${message}:`, error);
    const errorMessage = error || message;
    return throwError(() => new Error(errorMessage));
  }
}
