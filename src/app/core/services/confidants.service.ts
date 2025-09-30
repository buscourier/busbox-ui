import { Injectable } from '@angular/core';
import { catchError, type Observable, shareReplay } from 'rxjs';
import { map } from 'rxjs/operators';

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
      .pipe(
        map((confidants) => this.removeDuplicatesById(confidants)),
        catchError(this.handleError.bind(this)),
        shareReplay(1),
      );
  }

  private removeDuplicatesById(confidants: Confidant[]): Confidant[] {
    const seen = new Set<string>();
    return confidants.filter((confidant) => {
      if (seen.has(confidant.id)) {
        return false;
      }
      seen.add(confidant.id);
      return true;
    });
  }
}
