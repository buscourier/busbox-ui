import { Injectable } from '@angular/core';

import {
  PageOrientation,
  PdfGeneratorService,
  type PdfOptions,
} from '@core/services/pdf-generator.service';

import type { OrderInfo } from '../types';

@Injectable({
  providedIn: 'root',
})
export class InvoiceGeneratorService extends PdfGeneratorService {
  protected override get defaultOptions(): Required<PdfOptions> {
    return {
      ...super.defaultOptions,
      filename: 'Накладная.pdf',
      orientation: PageOrientation.LANDSCAPE,
    };
  }

  protected override validateInputs(sourceElement: HTMLElement, data: unknown): void {
    super.validateInputs(sourceElement, data);

    const orderInfo = data as OrderInfo;
    if (!orderInfo?.order_id) {
      throw new Error('Некорректные данные накладной');
    }
  }

  protected async createPageContainers(
    sourceElement: HTMLElement,
    data: unknown,
    config: Required<PdfOptions>,
  ): Promise<HTMLElement[]> {
    const containers: HTMLElement[] = [];
    const invoiceData = data as OrderInfo;
    console.log('invoiceData', invoiceData);

    try {
      if (this.isPortraitOrientation) {
        const page1Container = this.createPage(sourceElement, config, 1);

        const page2Container = this.createPage(sourceElement, config, 2);

        containers.push(page1Container, page2Container);
      } else {
        const page1Container = this.createPage(sourceElement, config, 1);

        containers.push(page1Container);
      }

      containers.forEach((container) => document.body.appendChild(container));

      await Promise.all(containers.map((container) => this.ensureImagesLoaded(container)));
      await this.waitForRender(300);

      return containers;
    } catch (error) {
      this.cleanupContainers(containers);
      throw error;
    }
  }

  private createPage(
    sourceElement: HTMLElement,
    config: Required<PdfOptions>,
    pageNumber: number,
  ): HTMLElement {
    const container = this.createPageContainer(sourceElement, config, pageNumber);

    if (this.isPortraitOrientation) {
      if (pageNumber === 1) {
        this.addSourceElementCopy(container, sourceElement);
        this.addPageSeparator(container);
        this.addSourceElementCopy(container, sourceElement);
      } else {
        this.addSourceElementCopy(container, sourceElement);
      }

      return container;
    }

    Object.assign(container.style, {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      gap: '12mm',
      // padding: '2mm',
      boxSizing: 'border-box',
      position: 'relative',
    });

    this.addSourceElementCopy(container, sourceElement);
    this.addSourceElementCopy(container, sourceElement);
    this.addSourceElementCopy(container, sourceElement);
    this.addSourceElementCopy(container, sourceElement);

    this.addGridSeparators(container);

    return container;
  }

  // async generateInvoicePDF(
  //   sourceElement: HTMLElement,
  //   invoiceData: OrderInfo,
  //   options: Partial<PdfOptions> = {},
  // ): Promise<PdfGenerationResult> {
  //   return this.generatePDF(sourceElement, invoiceData, options);
  // }
}
