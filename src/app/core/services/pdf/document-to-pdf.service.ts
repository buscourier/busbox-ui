import { inject, Injectable } from '@angular/core';
import { WA_WINDOW } from '@ng-web-apis/common';
import { TUI_IS_MOBILE } from '@taiga-ui/cdk';

import {
  DOCUMENT_RENDERER,
  DOM_PROCESSOR,
  IMAGE_CONVERTER,
  PDF_BUILDER,
  PROGRESS_INDICATOR,
} from '@core/tokens';

import {
  type DocumentCopyOptions,
  type DocumentProcessingOptions,
  ImageFormat,
  type MultiElementData,
  PageFormat,
  PageOrientation,
  type PdfGenerationOptions,
  type PdfGenerationResult,
} from '@shared/types';

export interface DocumentRenderer<T> {
  renderDocumentPages(
    sourceElement: HTMLElement | null,
    data: T,
    options: PdfGenerationOptions & DocumentCopyOptions,
  ): Promise<HTMLElement[]>;
}

@Injectable({ providedIn: 'root' })
export class DocumentToPdfService<T = unknown> {
  private readonly window = inject(WA_WINDOW);
  private readonly isMobile = inject(TUI_IS_MOBILE);

  private get defaultProcessingOptions(): Required<DocumentProcessingOptions> {
    const devicePixelRatio = this.window.devicePixelRatio || 1;

    // Limit parameters for mobile devices to avoid memory issues
    const isMobile = this.isMobile;
    const maxPixelRatio = isMobile ? 1.5 : 2;
    const defaultScale = isMobile ? 1 : 1;
    const defaultQuality = isMobile ? 0.85 : 0.95;

    return {
      scale: defaultScale,
      quality: defaultQuality,
      pixelRatio: Math.min(devicePixelRatio, maxPixelRatio),
      skipFonts: true,
      includeQueryParams: false,
      imageLoadTimeout: isMobile ? 10000 : 5000, // Больше времени на мобильных
      renderWaitTime: isMobile ? 300 : 200,
      imageFormat: ImageFormat.JPEG, // JPEG легче чем PNG
    };
  }

  private readonly defaultGenerationOptions: Required<PdfGenerationOptions> = {
    filename: 'document.pdf',
    format: PageFormat.A4,
    orientation: PageOrientation.PORTRAIT,
    imageFormat: ImageFormat.JPEG,
    showProgress: true,
    autoDownload: true,
    onProgress: (current, total) => {
      console.log(`Processing page ${current} of ${total}`);
    },
  };

  private readonly domProcessor = inject(DOM_PROCESSOR);
  private readonly imageConverter = inject(IMAGE_CONVERTER);
  private readonly pdfBuilder = inject(PDF_BUILDER);
  private readonly progressIndicator = inject(PROGRESS_INDICATOR);
  private readonly documentRenderer = inject(DOCUMENT_RENDERER);

  async generatePdf(
    sourceElement: HTMLElement | null,
    data: T,
    processingOptions: Partial<DocumentProcessingOptions> = {},
    generationOptions: Partial<PdfGenerationOptions> = {},
    copyOptions: Partial<DocumentCopyOptions> = {},
  ): Promise<PdfGenerationResult> {
    const procConfig = { ...this.defaultProcessingOptions, ...processingOptions };
    const genConfig = { ...this.defaultGenerationOptions, ...generationOptions };

    try {
      // If sourceElement needed (not MultiElementData)
      if (sourceElement !== null || !this.isMultiElementData(data)) {
        this.validateInputs(sourceElement, data);
      }

      if (genConfig.showProgress) {
        this.progressIndicator.show();
      }

      const pageElements = await this.documentRenderer.renderDocumentPages(sourceElement, data, {
        ...genConfig,
        ...copyOptions,
      });

      try {
        const blob = await this.convertPagesToPdf(pageElements, procConfig, genConfig);

        if (genConfig.autoDownload) {
          this.downloadBlob(blob, genConfig.filename);
        }

        return {
          success: true,
          filename: genConfig.filename,
          pageCount: this.pdfBuilder.getPageCount(),
          fileSize: blob.size,
          blob,
        };
      } finally {
        this.cleanupPageElements(pageElements);
      }
    } catch (error) {
      console.error('PDF generation error:', error);

      // Special handling of memory errors on mobile devices
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (
        this.isMobile &&
        (errorMessage.includes('memory') ||
          errorMessage.includes('canvas') ||
          errorMessage.includes('allocation'))
      ) {
        errorMessage = 'Not enough memory to generate the image on mobile device';
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      if (genConfig.showProgress) {
        this.progressIndicator.hide();
      }
    }
  }

  private isMultiElementData(data: unknown): data is MultiElementData<unknown> {
    return (
      data !== null &&
      typeof data === 'object' &&
      'elements' in data &&
      Array.isArray((data as Record<string, unknown>)['elements'])
    );
  }

  private validateInputs(sourceElement: HTMLElement | null, data: T): void {
    if (this.isMultiElementData(data)) {
      if (!data.elements || data.elements.length === 0) {
        throw new Error('No elements provided for multi-element rendering');
      }
      return;
    }

    // validate sourceElement if it only one
    if (!sourceElement) {
      throw new Error('Source element not found');
    }

    if (sourceElement.offsetWidth === 0 || sourceElement.offsetHeight === 0) {
      throw new Error('Source element has zero dimensions');
    }

    if (data === null || data === undefined) {
      throw new Error('Invalid document data');
    }
  }

  private async convertPagesToPdf(
    pageElements: HTMLElement[],
    processingOptions: Required<DocumentProcessingOptions>,
    generationOptions: Required<PdfGenerationOptions>,
  ): Promise<Blob> {
    for (let i = 0; i < pageElements.length; i++) {
      const element = pageElements[i];

      try {
        await this.domProcessor.waitForImagesLoad(element, processingOptions.imageLoadTimeout);

        const imageData = await this.imageConverter.convertElementToImage(
          element,
          processingOptions,
        );

        await this.pdfBuilder.addPage(imageData, generationOptions);

        generationOptions.onProgress(i + 1, pageElements.length);
        this.progressIndicator.updateProgress(i + 1, pageElements.length);
      } catch (error) {
        console.error(`Error processing page ${i + 1}:`, error);
        throw new Error(`Failed to process page ${i + 1}: ${error}`);
      }
    }

    return await this.pdfBuilder.build();
  }

  private cleanupPageElements(elements: HTMLElement[]): void {
    elements.forEach((element) => {
      element.parentNode?.removeChild(element);
    });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  createBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  revokeBlobUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
