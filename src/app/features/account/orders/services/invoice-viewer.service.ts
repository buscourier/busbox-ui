import { inject, Injectable, type TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import { DocumentToPdfService, PdfViewerService } from '@core/services/pdf';

import type {
  DocumentCopyOptions,
  DocumentProcessingOptions,
  PdfGenerationOptions,
  PdfViewerOptions,
} from '@shared/types';

export interface InvoiceGenerationOptions {
  processing?: Partial<DocumentProcessingOptions>;
  generation?: Partial<PdfGenerationOptions>;
  copies?: Partial<DocumentCopyOptions>;
}

export interface InvoiceViewerOptions extends PdfViewerOptions {
  generationOptions?: InvoiceGenerationOptions;
  customActions?: TemplateRef<unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceViewerService extends PdfViewerService {
  private readonly documentToPdfService = inject(DocumentToPdfService);

  generateAndShowPdf<T>(
    sourceElement: HTMLElement | null,
    data: T,
    label: string,
    options: InvoiceViewerOptions = {},
  ): Observable<void> {
    return new Observable<void>((subscriber) => {
      const generationOptions = options.generationOptions || {};

      // Adaptive settings for mobile devices
      const defaultProcessing = this.isMobile
        ? { scale: 1.5, quality: 0.8 }
        : { scale: 2.0, quality: 0.9 };

      // Download PDF on mobile devices, show viewer on desktop
      const shouldAutoDownload = options.autoDownload ?? this.isMobile;

      this.documentToPdfService
        .generatePdf(
          sourceElement,
          data,
          { ...defaultProcessing, ...generationOptions.processing },
          { ...generationOptions.generation, autoDownload: shouldAutoDownload },
          generationOptions.copies,
        )
        .then((result) => {
          if (!result.success || !result.blob) {
            subscriber.error(new Error(result.error || 'PDF generation failed'));
            return;
          }

          // Don's show viewer on mobile devices
          if (this.isMobile) {
            subscriber.next();
            subscriber.complete();
            return;
          }

          this.showPdfFromBlob(result.blob, label, {
            ...options,
            autoDownload: false,
            customActions: options.customActions,
          }).subscribe({
            next: () => subscriber.next(),
            error: (error) => subscriber.error(error),
            complete: () => subscriber.complete(),
          });
        })
        .catch((error) => subscriber.error(error));
    });
  }
}
