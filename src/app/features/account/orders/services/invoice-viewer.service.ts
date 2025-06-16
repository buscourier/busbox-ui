import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { PdfOptions } from '@core/services/pdf-generator.service';
import { type PdfViewerOptions, PdfViewerService } from '@core/services/pdf-viewer.service';

import { InvoiceGeneratorService } from './invoice-generator.service';

export interface InvoiceViewerOptions extends PdfViewerOptions {
  generationOptions?: Partial<PdfOptions>;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceViewerService extends PdfViewerService {
  private readonly invoiceGenerator = inject(InvoiceGeneratorService);

  /**
   * Генерирует PDF и показывает в viewer
   */
  generateAndShowPdf<T>(
    sourceElement: HTMLElement,
    data: T,
    label: string,
    options: InvoiceViewerOptions = {},
  ): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.invoiceGenerator
        .generatePDF(sourceElement, data, options.generationOptions)
        .then((result) => {
          if (!result.success || !result.blob) {
            subscriber.error(new Error(result.error || 'Ошибка генерации PDF'));
            return;
          }

          // Показываем сгенерированный PDF
          this.showPdfFromBlob(result.blob, label, options).subscribe({
            next: () => subscriber.next(),
            error: (error) => subscriber.error(error),
            complete: () => subscriber.complete(),
          });
        })
        .catch((error) => subscriber.error(error));
    });
  }

  /**
   * Генерирует PDF и сразу скачивает
   */
  generateAndDownloadPdf<T>(
    sourceElement: HTMLElement,
    data: T,
    filename?: string,
    options: Partial<PdfOptions> = {},
  ): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.invoiceGenerator
        .generatePDF(sourceElement, data, options)
        .then((result) => {
          if (!result.success || !result.blob) {
            subscriber.error(new Error(result.error || 'Ошибка генерации PDF'));
            return;
          }

          const finalFilename = filename || result.filename || this.getDefaultFilename();
          this.downloadPdfFromBlob(result.blob, finalFilename);

          subscriber.next();
          subscriber.complete();
        })
        .catch((error) => subscriber.error(error));
    });
  }

  protected override getDefaultFilename(): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `generated_document_${timestamp}.pdf`;
  }
}
