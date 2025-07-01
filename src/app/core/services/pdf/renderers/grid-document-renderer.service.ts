import { inject, Injectable } from '@angular/core';

import { DOM_PROCESSOR } from '@core/tokens';

import { type DocumentCopyOptions, PageFormat, type PdfGenerationOptions } from '@shared/types';

import type { DocumentRenderer } from '../document-to-pdf.service';

@Injectable({
  providedIn: 'root',
})
export class GridDocumentRendererService<T> implements DocumentRenderer<T> {
  private readonly domProcessor = inject(DOM_PROCESSOR);

  async renderDocumentPages(
    sourceElement: HTMLElement,
    data: T,
    options: PdfGenerationOptions & DocumentCopyOptions,
  ): Promise<HTMLElement[]> {
    const copyLabels = options.copyLabels || [
      'Оригинал',
      'Копия покупателя',
      'Копия продавца',
      'Архивная копия',
    ];

    const container = this.createGridPageContainer(options.format || PageFormat.A4);
    this.addGridCopies(container, sourceElement, copyLabels.slice(0, 4));

    document.body.appendChild(container);
    await this.waitForRender(300);

    return [container];
  }

  private createGridPageContainer(format: PageFormat): HTMLElement {
    const container = document.createElement('div');
    container.id = `pdf-grid-page-${Date.now()}-${Math.random()}`;

    // Album orientation
    const dimensions =
      format === PageFormat.A4
        ? { width: '297mm', height: '210mm' }
        : { width: '11in', height: '8.5in' };

    Object.assign(container.style, {
      ...dimensions,
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '8px',
      padding: '5mm',
      boxSizing: 'border-box',
      overflow: 'hidden',

      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '5mm',

      alignItems: 'center',
      width: '100%',
      height: 'auto',
    });

    return container;
  }

  private addGridCopies(
    container: HTMLElement,
    sourceElement: HTMLElement,
    copyLabels: string[],
  ): void {
    for (let i = 0; i < 4; i++) {
      const copyContainer = this.createGridCopyContainer(i + 1);
      const processedElement = this.domProcessor.prepareElementForPrint(sourceElement);

      this.addCopyHeader(copyContainer, i + 1, copyLabels[i]);
      this.scaleContentForCopy(processedElement);
      copyContainer.appendChild(processedElement);

      container.appendChild(copyContainer);
    }
  }

  private createGridCopyContainer(copyNumber: number): HTMLElement {
    const copy = document.createElement('div');
    copy.className = `copy-${copyNumber}`;

    Object.assign(copy.style, {
      backgroundColor: 'white',
      // border: '0.5px solid #ddd',
      boxSizing: 'border-box',
      // padding: '2mm',
      overflow: 'hidden',
      fontSize: '7px',

      minHeight: '0',
      minWidth: '0',

      display: 'flex',
      flexDirection: 'column',
    });

    return copy;
  }

  private addCopyHeader(container: HTMLElement, copyNumber: number, label: string): void {
    const header = document.createElement('div');
    Object.assign(header.style, {
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '1mm',
      fontSize: '8px',
      color: '#000',
      borderBottom: '0.5px solid #ccc',
      paddingBottom: '1mm',
      lineHeight: '1.2',

      flexShrink: '0',
    });
    header.textContent = `${copyNumber}. ${label.toUpperCase()}`;
    container.appendChild(header);
  }

  private scaleContentForCopy(element: HTMLElement): HTMLDivElement {
    const contentWrapper = document.createElement('div');
    Object.assign(contentWrapper.style, {
      flex: '1',
      overflow: 'hidden',
      transform: 'scale(0.85)',
      transformOrigin: 'top left',
      fontSize: '6px',
      lineHeight: '1.1',
    });

    contentWrapper.appendChild(element);

    const images = element.querySelectorAll('img');
    images.forEach((img) => {
      Object.assign((img as HTMLImageElement).style, {
        maxWidth: '100%',
        height: 'auto',
      });
    });

    return contentWrapper;
  }

  private async waitForRender(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
