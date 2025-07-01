import { inject, Injectable } from '@angular/core';

import { DOM_PROCESSOR } from '@core/tokens';

import { type DocumentCopyOptions, PageFormat, type PdfGenerationOptions } from '@shared/types';

import type { DocumentRenderer } from '../document-to-pdf.service';

@Injectable({ providedIn: 'root' })
export class MultiCopyDocumentRenderer<T> implements DocumentRenderer<T> {
  private readonly domProcessor = inject(DOM_PROCESSOR);

  async renderDocumentPages(
    sourceElement: HTMLElement,
    data: T,
    options: PdfGenerationOptions & DocumentCopyOptions,
  ): Promise<HTMLElement[]> {
    const copyLabels = options.copyLabels || ['Копия 1', 'Копия 2', 'Копия 3'];
    const pageElements: HTMLElement[] = [];

    for (let i = 0; i < copyLabels.length; i++) {
      const container = this.createPageContainer(options.format || PageFormat.A4);
      const processedElement = this.domProcessor.prepareElementForPrint(sourceElement);

      this.addCopyHeader(container, i + 1, copyLabels[i]);
      container.appendChild(processedElement);

      if (options.addSeparators && i < copyLabels.length - 1) {
        this.addPageSeparator(container);
      }

      document.body.appendChild(container);
      pageElements.push(container);
    }

    await this.waitForRender(200);
    return pageElements;
  }

  private createPageContainer(format: PageFormat): HTMLElement {
    const container = document.createElement('div');
    container.id = `pdf-page-${Date.now()}-${Math.random()}`;

    const dimensions =
      format === PageFormat.A4
        ? { width: '210mm', height: '297mm' }
        : { width: '8.5in', height: '11in' };

    Object.assign(container.style, {
      ...dimensions,
      // position: 'absolute',
      // top: '-9999px',
      // left: '-9999px',
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      padding: '8mm',
      boxSizing: 'border-box',
      overflow: 'hidden',
    });

    return container;
  }

  private addCopyHeader(container: HTMLElement, copyNumber: number, label: string): void {
    const header = document.createElement('div');
    Object.assign(header.style, {
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '4mm',
      fontSize: '12px',
      color: '#000',
      height: '6mm',
      borderBottom: '1px solid #ccc',
      paddingBottom: '2mm',
    });
    header.textContent = `ЭКЗЕМПЛЯР ${copyNumber} (${label.toUpperCase()})`;
    container.appendChild(header);
  }

  private addPageSeparator(container: HTMLElement): void {
    const separator = document.createElement('div');
    Object.assign(separator.style, {
      borderTop: '1px dashed #999',
      margin: '8mm 0',
      width: '100%',
      height: '1px',
    });
    container.appendChild(separator);
  }

  private async waitForRender(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
