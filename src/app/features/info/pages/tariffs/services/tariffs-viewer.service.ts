import { inject, Injectable, type TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import { DocumentToPdfService, PdfViewerService } from '@core/services/pdf';

import {
  type DocumentProcessingOptions,
  type MultiElementData,
  PageFormat,
  type PdfGenerationOptions,
  type PdfViewerOptions,
  type PickupCity,
} from '@shared/types';

export interface TariffsGenerationOptions {
  processing?: Partial<DocumentProcessingOptions>;
  generation?: Partial<PdfGenerationOptions>;
  showProgress?: boolean;
  filename?: string;
}

export interface TariffsViewerOptions extends PdfViewerOptions {
  generationOptions?: TariffsGenerationOptions;
  customActions?: TemplateRef<unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class TariffsViewerService extends PdfViewerService {
  private readonly documentToPdfService = inject(DocumentToPdfService);

  generateTariffs(
    containers: {
      zones?: HTMLElement;
      parcelsFirst?: HTMLElement;
      parcelsSecond?: HTMLElement;
      autoparts?: HTMLElement;
      other?: HTMLElement;
    },
    city: PickupCity,
    options: TariffsViewerOptions = {},
  ): Observable<void> {
    const elements = [
      containers.zones,
      containers.parcelsFirst,
      containers.parcelsSecond,
      containers.autoparts,
      containers.other,
    ].filter(Boolean) as HTMLElement[];

    if (elements.length === 0) {
      return new Observable((subscriber) =>
        subscriber.error(new Error('No valid containers provided')),
      );
    }

    const labels: string[] = [];
    if (containers.zones) labels.push('Зоны доставки');
    if (containers.parcelsFirst) labels.push('Документы и грузы');
    if (containers.parcelsSecond) labels.push('Документы и грузы');
    if (containers.autoparts) labels.push('Автозапчасти');
    if (containers.other) labels.push('Другое');

    return new Observable<void>((subscriber) => {
      const multiData: MultiElementData = {
        elements,
        pageLabels: labels,
        data: city,
        coverPage: {
          title: `ТАРИФЫ ДОСТАВКИ - ${city?.name?.toUpperCase() || 'ГОРОД'}`,
          description: `Тарифы указаны только для филиалов «Баскурьер». Чтобы узнать стоимость отправления
          из других населенных пунктов, свяжитесь с оператором.`,
        },
      };

      // Adaptive settings for mobile devices
      const defaultProcessing = this.isMobile
        ? { scale: 1.5, quality: 0.8, renderWaitTime: 500 } // More time for table rendering
        : { scale: 2.0, quality: 0.9, renderWaitTime: 300 };

      this.documentToPdfService
        .generatePdf(
          null,
          multiData,
          options.generationOptions?.processing || defaultProcessing,
          options.generationOptions?.generation || {
            filename: options.generationOptions?.filename || `tariffs_${city?.name || 'city'}.pdf`,
            format: PageFormat.A4,
            showProgress: options.generationOptions?.showProgress ?? true,
          },
          {},
        )
        .then((result) => {
          if (!result.success || !result.blob) {
            subscriber.error(new Error(result.error || 'PDF generation failed'));
            return;
          }

          this.showPdfFromBlob(result.blob, 'Тарифы доставки', {
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
