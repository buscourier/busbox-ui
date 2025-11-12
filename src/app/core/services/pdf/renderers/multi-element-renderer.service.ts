import { inject, Injectable } from '@angular/core';

import { DOM_PROCESSOR } from '@core/tokens';

import {
  type CoverPage,
  type DocumentCopyOptions,
  type MultiElementData,
  type PageConfig,
  PageFormat,
  type PdfGenerationOptions,
} from '@shared/types';

import type { DocumentRenderer } from '../document-to-pdf.service';

@Injectable({
  providedIn: 'root',
})
export class MultiElementRenderer<T> implements DocumentRenderer<MultiElementData<T>> {
  private readonly domProcessor = inject(DOM_PROCESSOR);

  async renderDocumentPages(
    sourceElement: HTMLElement, // It is not used here
    data: MultiElementData<T>,
    options: PdfGenerationOptions & DocumentCopyOptions,
  ): Promise<HTMLElement[]> {
    const { elements, pageLabels, pageConfigs, coverPage } = data;

    if (!elements || elements.length === 0) {
      throw new Error('No elements provided for multi-element rendering');
    }

    const pageElements: HTMLElement[] = [];

    if (coverPage) {
      const coverPageContainer = this.createCoverPageContainer(coverPage, options.format);
      document.body.appendChild(coverPageContainer);
      pageElements.push(coverPageContainer);
    }

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const pageLabel = pageLabels?.[i] || `Страница ${i + 1}`;
      const pageConfig = pageConfigs?.[i];

      const container = this.createPageContainer(pageConfig || { element }, i + 1, options.format);

      const processedElement = this.domProcessor.prepareElementForPrint(element);

      if (pageLabel && pageLabel.trim() !== '') {
        this.addSectionHeader(container, i + 1, pageLabel);
      }

      this.applyElementStyling(processedElement, pageConfig || { element });
      container.appendChild(processedElement);

      document.body.appendChild(container);
      pageElements.push(container);
    }

    // Increased timeout for stable table rendering
    await this.waitForRender(500);
    return pageElements;
  }

  private createPageContainer(
    config: PageConfig,
    pageNumber: number,
    defaultFormat?: PageFormat,
  ): HTMLElement {
    const container = document.createElement('div');
    container.id = `pdf-multi-page-${pageNumber}-${Date.now()}-${Math.random()}`;

    const format = config.format || defaultFormat || PageFormat.A4;
    const isLandscape = config.orientation === 'landscape';

    let dimensions: { width: string; height: string };
    if (format === PageFormat.A4) {
      dimensions = isLandscape
        ? { width: '297mm', height: '210mm' }
        : { width: '210mm', height: '297mm' };
    } else {
      dimensions = isLandscape
        ? { width: '11in', height: '8.5in' }
        : { width: '8.5in', height: '11in' };
    }

    Object.assign(container.style, {
      ...dimensions,
      backgroundColor: config.backgroundColor || 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      padding: config.padding || '8mm',
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'relative',

      display: 'flex',
      flexDirection: 'column',
    });

    return container;
  }

  private applyElementStyling(element: HTMLElement, config: PageConfig): void {
    const scale = config.scale || 1.0;

    Object.assign(element.style, {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      fontSize: `${10 / scale}px`,
      lineHeight: '1.2',
      width: `${100 / scale}%`,
      overflow: 'visible',
    });

    if (config.orientation === 'landscape') {
      element.style.maxWidth = '100%';
      element.style.width = '100%';
    }

    const images = element.querySelectorAll('img');
    images.forEach((img) => {
      Object.assign((img as HTMLImageElement).style, {
        maxWidth: '100%',
        height: 'auto',
        objectFit: 'contain',
      });
    });

    const tables = element.querySelectorAll('table');
    tables.forEach((table) => {
      Object.assign((table as HTMLElement).style, {
        width: '100%',
        fontSize: 'inherit',
        tableLayout: 'auto',
      });
    });
  }

  private createCoverPageContainer(coverPage: CoverPage, format?: PageFormat): HTMLElement {
    const { title, description } = coverPage;

    const container = this.createPageContainer(
      { element: document.createElement('div') },
      0,
      format,
    );

    Object.assign(container.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
    });

    const titleElement = document.createElement('div');
    Object.assign(titleElement.style, {
      fontSize: '24px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    });
    titleElement.textContent = title;

    container.appendChild(titleElement);

    if (description) {
      const descriptionElement = document.createElement('div');
      Object.assign(descriptionElement.style, {
        marginTop: '4px',
        fontSize: '16px',
      });
      descriptionElement.textContent = description;

      container.appendChild(descriptionElement);
    }

    return container;
  }

  private addSectionHeader(container: HTMLElement, pageNumber: number, label: string): void {
    const header = document.createElement('div');
    Object.assign(header.style, {
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '4mm',
      fontSize: '18px',
      color: '#000',
      borderBottom: '1px solid #e6e6e6',
      paddingBottom: '4mm',
      lineHeight: '1.4',
      flexShrink: '0',
    });
    header.textContent = label.toUpperCase();
    container.appendChild(header);
  }

  private async waitForRender(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
