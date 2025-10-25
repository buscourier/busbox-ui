import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

import { ApiService } from '@core/services';

import type { ContactFormPayload } from './contact-form.types';

type MailerResponse = boolean;

interface BitrixResponse {
  result: number;
  time: {
    date_start: string;
    date_finish: string;
    start: number;
    finish: number;
    duration: number;
    processing: number;
  };
}

interface ContactFormResult {
  mailerSuccess: boolean;
  bitrixSuccess: boolean;
  mailerResponse?: MailerResponse;
  bitrixResponse?: BitrixResponse;
  bitrixLeadId?: number;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactFormService extends ApiService {
  private readonly mailerUrl = `${this.baseUrl}/site/mailer`;
  private readonly bitrixUrl = `https://bitrix.busbox.guru/rest/1/xk0350plspumy30m/crm.lead.add`;

  submitContactForm(formData: ContactFormPayload): Observable<ContactFormResult> {
    return this.sendForm(formData).pipe(
      switchMap((mailerResponse) => {
        // If mailer success, send to Bitrix
        if (mailerResponse) {
          return this.sendFormToBitrix(formData).pipe(
            map(
              (bitrixResponse) =>
                ({
                  mailerSuccess: true,
                  bitrixSuccess: true,
                  mailerResponse,
                  bitrixResponse,
                  bitrixLeadId: bitrixResponse.result,
                }) as ContactFormResult,
            ),

            catchError((bitrixError) =>
              of({
                mailerSuccess: true,
                bitrixSuccess: false,
                mailerResponse,
                error: `Ошибка сохранения в CRM: ${bitrixError.message}`,
              } as ContactFormResult),
            ),
          );
        } else {
          return throwError(
            () =>
              ({
                mailerSuccess: false,
                bitrixSuccess: false,
                mailerResponse,
                error: 'Ошибка отправки письма',
              }) as ContactFormResult,
          );
        }
      }),
      catchError((mailerError) =>
        throwError(
          () =>
            ({
              mailerSuccess: false,
              bitrixSuccess: false,
              error: `Ошибка отправки письма: ${mailerError.message}`,
            }) as ContactFormResult,
        ),
      ),
    );
  }

  private sendForm(formData: ContactFormPayload): Observable<MailerResponse> {
    const requestPayload = {
      ...formData,
    };

    return this.http
      .post<MailerResponse>(this.mailerUrl, JSON.stringify(requestPayload))
      .pipe(catchError(this.handleError.bind(this)));
  }

  private sendFormToBitrix(payload: ContactFormPayload): Observable<BitrixResponse> {
    const params = new HttpParams({
      fromObject: {
        'fields[TITLE]': payload.formTitle,
        'fields[NAME]': payload.userName,
        'fields[PHONE][0][VALUE_TYPE]': 'WORK',
        'fields[PHONE][0][VALUE]': payload.phone,
        'fields[EMAIL][0][VALUE_TYPE]': 'WORK',
        'fields[EMAIL][0][VALUE]': payload.email,
        'fields[SOURCE_ID]': 'UC_90HLMC',
        'fields[COMMENTS]': payload.message,
        // 'fields[TRACE]': payload.trace,
      },
    });

    return this.http
      .get<BitrixResponse>(this.bitrixUrl, { params })
      .pipe(catchError(this.handleError.bind(this)));
  }

  isSubmissionSuccessful(result: ContactFormResult): boolean {
    return result.mailerSuccess && result.bitrixSuccess;
  }

  getStatusMessage(result: ContactFormResult): string {
    if (result.mailerSuccess && result.bitrixSuccess) {
      return 'Информация успешно отправлена!';
    } else if (result.mailerSuccess && !result.bitrixSuccess) {
      return 'Информация отправлена, но возникла проблема с сохранением в CRM';
    } else {
      return result.error || 'Ошибка отправки заявки. Попробуйте позже.';
    }
  }

  getBitrixLeadId(result: ContactFormResult): number | null {
    return result.bitrixLeadId || null;
  }
}
