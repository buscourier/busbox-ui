import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, type Observable, shareReplay } from 'rxjs';

import { ApiService } from '@core/services';

import { environment } from '@env/environment';

import type { Confidant, ProfileField } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  getFields(userId: string): Observable<ProfileField[]> {
    return this.http
      .get<ProfileField[]>(`${this.baseUrl}/account/details/${environment.apiKey}/${userId}`)
      .pipe(catchError(this.handleError.bind(this)), shareReplay(1));
  }

  updateFields(userId: string, payload: unknown): Observable<ProfileField[]> {
    return this.http
      .post<
        ProfileField[]
      >(`${this.baseUrl}/account/details/${environment.apiKey}/${userId}`, payload)
      .pipe(catchError(this.handleError.bind(this)), shareReplay(1));
  }

  getConfidants(userId: string): Observable<Confidant[]> {
    return this.http
      .get<Confidant[]>(`${this.baseUrl}/account/contactperson/${environment.apiKey}/${userId}`)
      .pipe(catchError(this.handleError.bind(this)), shareReplay(1));
  }
}
