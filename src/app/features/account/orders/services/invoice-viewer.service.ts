import { inject, Injectable, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import type { PdfOptions } from '@core/services/pdf-generator.service';
import { type PdfViewerOptions, PdfViewerService } from '@core/services/pdf-viewer.service';

import { InvoiceGeneratorService } from './invoice-generator.service';

export interface InvoiceViewerOptions extends PdfViewerOptions {
  generationOptions?: Partial<PdfOptions>;
  customActions?: TemplateRef<unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceViewerService extends PdfViewerService {
  private readonly invoiceGenerator = inject(InvoiceGeneratorService);

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

          if (options.autoDownload !== false) {
            const filename = result.filename || this.getDefaultFilename();
            this.downloadPdfFromBlob(result.blob, filename);
          }

          // const blobUrl = this.createBlobUrl(result.blob);

          console.log('options.customActions', options.customActions);

          this.showPdfFromBlob(result.blob, label, {
            ...options,
            autoDownload: false,
            customActions: options.customActions ? options.customActions : undefined,
          }).subscribe({
            next: () => subscriber.next(),
            error: (error) => subscriber.error(error),
            complete: () => subscriber.complete(),
          });
        })
        .catch((error) => subscriber.error(error));
    });
  }

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
