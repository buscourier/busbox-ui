import { inject, Injectable } from '@angular/core';

import { DOM_PROCESSOR } from '@core/tokens';

import { type DocumentCopyOptions, PageFormat, type PdfGenerationOptions } from '@shared/types';

import type { DocumentRenderer } from '../document-to-pdf.service';

@Injectable({
  providedIn: 'root',
})
export class DualDocumentRenderer<T> implements DocumentRenderer<T> {
  private readonly domProcessor = inject(DOM_PROCESSOR);

  async renderDocumentPages(
    sourceElement: HTMLElement,
    data: T,
    options: PdfGenerationOptions & DocumentCopyOptions,
  ): Promise<HTMLElement[]> {
    const copyLabels = options.copyLabels || ['Оригинал', 'Копия'];
    const pageElements: HTMLElement[] = [];

    for (let i = 0; i < copyLabels.length; i += 2) {
      const pageCopies = copyLabels.slice(i, i + 2);
      const container = this.createDualPageContainer(options.format || PageFormat.A4);

      for (let j = 0; j < pageCopies.length; j++) {
        const copyContainer = this.createDualCopyContainer(j + 1);
        const processedElement = this.domProcessor.prepareElementForPrint(sourceElement);

        this.addCopyHeader(copyContainer, i + j + 1, pageCopies[j]);
        this.scaleDualCopyContent(processedElement);
        copyContainer.appendChild(processedElement);

        container.appendChild(copyContainer);
      }

      document.body.appendChild(container);
      pageElements.push(container);
    }

    await this.waitForRender(200);
    return pageElements;
  }

  private createDualPageContainer(format: PageFormat): HTMLElement {
    const container = document.createElement('div');
    container.id = `pdf-dual-page-${Date.now()}-${Math.random()}`;

    const dimensions =
      format === PageFormat.A4
        ? { width: '210mm', height: '297mm' }
        : { width: '8.5in', height: '11in' };

    Object.assign(container.style, {
      ...dimensions,
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      padding: '4mm',
      boxSizing: 'border-box',
      overflow: 'hidden',

      // Vertical position of two copies
      display: 'flex',
      flexDirection: 'column',
      gap: '3mm',

      position: 'relative',
    });

    return container;
  }

  private createDualCopyContainer(copyNumber: number): HTMLElement {
    const copyContainer = document.createElement('div');
    copyContainer.className = `dual-copy-${copyNumber}`;

    Object.assign(copyContainer.style, {
      // backgroundColor: 'white',
      // border: '0.5px solid #ddd',
      // borderRadius: '1mm',
      // boxSizing: 'border-box',
      // padding: '3mm',
      // overflow: 'hidden',
      // flex: '1',
      // minHeight: '0',
      //
      // display: 'flex',
      // flexDirection: 'column',
      //
      // boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    });

    return copyContainer;
  }

  private scaleDualCopyContent(element: HTMLElement): void {
    Object.assign(element.style, {
      transform: 'scale(1)', // Масштаб для 2 копий
      transformOrigin: 'top left',
      fontSize: '9px',
      lineHeight: '1.2',
      width: '100%', // 100% / 0.9 ≈ 111%
      overflow: 'visible',
    });

    const images = element.querySelectorAll('img');
    images.forEach((img) => {
      Object.assign((img as HTMLImageElement).style, {
        maxWidth: '100%',
        height: 'auto',
      });
    });
  }

  private addCopyHeader(container: HTMLElement, copyNumber: number, label: string): void {
    const header = document.createElement('div');
    Object.assign(header.style, {
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '2mm',
      fontSize: '10px',
      color: '#000',
      borderBottom: '0.5px solid #ccc',
      paddingBottom: '1mm',
      lineHeight: '1.2',
      flexShrink: '0',
      backgroundColor: '#ffffff',
      borderRadius: '0.5mm',
      padding: '2mm',
    });
    header.textContent = `ЭКЗЕМПЛЯР ${copyNumber} (${label.toUpperCase()})`;
    container.appendChild(header);
  }

  private async waitForRender(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
