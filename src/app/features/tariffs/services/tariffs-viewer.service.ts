import { inject, Injectable, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import type { PdfOptions } from '@core/services/pdf-generator.service';
import { type PdfViewerOptions, PdfViewerService } from '@core/services/pdf-viewer.service';

import { TariffsGeneratorService } from './tariffs-generator.service';

export interface TariffsViewerOptions extends PdfViewerOptions {
  generationOptions?: Partial<PdfOptions>;
  customActions?: TemplateRef<unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class TariffsViewerService extends PdfViewerService {
  private readonly tariffsGenerator = inject(TariffsGeneratorService);

  generateAndShowPdf<T>(
    sourceElement: HTMLElement,
    data: T,
    label: string,
    options: TariffsViewerOptions = {},
  ): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.tariffsGenerator
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
}
