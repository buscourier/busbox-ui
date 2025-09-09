import { Injectable } from '@angular/core';
import { catchError, type Observable, shareReplay } from 'rxjs';

import { ApiService } from '@core/services/api.service';

import type { Confidant } from '@shared/types';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfidantsService extends ApiService {
  getConfidants(userId: string): Observable<Confidant[]> {
    return this.http
      .get<Confidant[]>(`${this.baseUrl}/account/contactperson/${environment.apiKey}/${userId}`)
      .pipe(catchError(this.handleError.bind(this)), shareReplay(1));
  }
}
