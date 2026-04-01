import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, type Observable, of, switchMap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import type { ApiError } from '@shared/types';

import type {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
} from './types';

interface SessionPayload {
  access_token: string;
  refresh_token?: string;
  access_expires_in?: number;
  refresh_expires_in?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private baseUrl = '/api';

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/account/login`, credentials).pipe(
      switchMap((resp) => {
        const payload: SessionPayload = { access_token: resp.auth_key };

        if (resp.refresh_token) payload.refresh_token = resp.refresh_token;
        if (resp.access_expires_in) payload.access_expires_in = resp.access_expires_in;
        if (resp.refresh_expires_in) payload.refresh_expires_in = resp.refresh_expires_in;

        return this.http.post('/auth/session', payload).pipe(map(() => resp));
      }),
      catchError((error: HttpErrorResponse) => throwError(() => this.toApiError(error))),
    );
  }

  register(userData: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/users`, userData)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiError(error))));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`/auth/logout`, {}).pipe(catchError(() => of(void 0)));
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/account/forgot-password`, { email })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiError(error))));
  }

  resetPassword(payload: ResetPasswordPayload): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/reset-password`, payload)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => this.toApiError(error))));
  }

  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`/auth/me`);
  }

  private toApiError(error: HttpErrorResponse): ApiError {
    const message: string = error.error?.message ?? error.message;
    return { message, statusCode: error.status };
  }
}
