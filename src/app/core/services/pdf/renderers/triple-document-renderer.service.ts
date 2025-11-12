import { inject, Injectable } from '@angular/core';

import { DOM_PROCESSOR } from '@core/tokens';

import { type DocumentCopyOptions, PageFormat, type PdfGenerationOptions } from '@shared/types';

import type { DocumentRenderer } from '../document-to-pdf.service';

/**
 * Рендерер для 3 копий документа на одной странице (вертикально)
 * Оптимален для мобильных устройств
 */
@Injectable({
  providedIn: 'root',
})
export class TripleDocumentRenderer<T> implements DocumentRenderer<T> {
  private readonly domProcessor = inject(DOM_PROCESSOR);

  async renderDocumentPages(
    sourceElement: HTMLElement,
    data: T,
    options: PdfGenerationOptions & DocumentCopyOptions,
  ): Promise<HTMLElement[]> {
    const copyLabels = options.copyLabels || ['Оригинал', 'Копия 1', 'Копия 2'];
    const pageElements: HTMLElement[] = [];

    // Создаем страницы по 3 копии
    for (let i = 0; i < copyLabels.length; i += 3) {
      const pageCopies = copyLabels.slice(i, i + 3);
      const container = this.createTriplePageContainer(options.format || PageFormat.A4);

      for (let j = 0; j < pageCopies.length; j++) {
        const copyContainer = this.createTripleCopyContainer(j + 1);
        const processedElement = this.domProcessor.prepareElementForPrint(sourceElement);

        this.scaleTripleCopyContent(processedElement);
        copyContainer.appendChild(processedElement);

        container.appendChild(copyContainer);
      }

      document.body.appendChild(container);
      pageElements.push(container);
    }

    await this.waitForRender(200);
    return pageElements;
  }

  private createTriplePageContainer(format: PageFormat): HTMLElement {
    const container = document.createElement('div');
    container.id = `pdf-triple-page-${Date.now()}-${Math.random()}`;

    const dimensions =
      format === PageFormat.A4
        ? { width: '210mm', height: '297mm' }
        : { width: '8.5in', height: '11in' };

    Object.assign(container.style, {
      ...dimensions,
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '9px',
      padding: '2mm',
      boxSizing: 'border-box',
      overflow: 'hidden',

      // Vertical layout for 3 copies
      display: 'flex',
      flexDirection: 'column',
      gap: '2mm',

      position: 'relative',
    });

    return container;
  }

  private createTripleCopyContainer(copyNumber: number): HTMLElement {
    const copyContainer = document.createElement('div');
    copyContainer.className = `triple-copy-${copyNumber}`;

    Object.assign(copyContainer.style, {
      flex: '1',
      minHeight: '0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    });

    return copyContainer;
  }

  private scaleTripleCopyContent(element: HTMLElement): void {
    Object.assign(element.style, {
      transform: 'scale(0.85)', // Небольшое уменьшение для 3 копий
      transformOrigin: 'top left',
      fontSize: '8px',
      lineHeight: '1.1',
      width: '100%',
      overflow: 'visible',
    });

    const images = element.querySelectorAll('img');
    images.forEach((img) => {
      Object.assign((img as HTMLImageElement).style, {
        maxWidth: '100%',
        height: 'auto',
      });
    });

    const tables = element.querySelectorAll('table');
    tables.forEach((table) => {
      Object.assign((table as HTMLElement).style, {
        width: '100%',
        fontSize: 'inherit',
      });
    });
  }

  private addCopyHeader(container: HTMLElement, copyNumber: number, label: string): void {
    const header = document.createElement('div');
    Object.assign(header.style, {
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '1.5mm',
      fontSize: '9px',
      color: '#000',
      borderBottom: '0.5px solid #ccc',
      paddingBottom: '1mm',
      lineHeight: '1.2',
      flexShrink: '0',
      backgroundColor: '#ffffff',
      borderRadius: '0.5mm',
      padding: '1mm',
    });
    header.textContent = `ЭКЗЕМПЛЯР ${copyNumber} (${label.toUpperCase()})`;
    container.appendChild(header);
  }

  private async waitForRender(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
