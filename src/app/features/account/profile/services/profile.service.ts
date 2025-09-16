import { Injectable } from '@angular/core';
import { catchError, type Observable, shareReplay } from 'rxjs';

import { ConfidantsService } from '@core/services';

import { environment } from '@env/environment';

import type { ProfileField } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends ConfidantsService {
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
}
