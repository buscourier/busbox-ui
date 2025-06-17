import { Injectable } from '@angular/core';

import { PdfGeneratorService, type PdfOptions } from '@core/services/pdf-generator.service';

import type { OrderInfo } from '../types';

@Injectable({
  providedIn: 'root',
})
export class InvoiceGeneratorService extends PdfGeneratorService {
  protected override get defaultOptions(): Required<PdfOptions> {
    return {
      ...super.defaultOptions,
      filename: 'Накладная.pdf',
      copyLabels: ['Отправитель', 'Получатель', 'Архив'],
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
      // Create containers for invoice pages
      const page1Container = this.createInvoicePage(sourceElement, config, 1);
      const page2Container = this.createInvoicePage(sourceElement, config, 2);

      containers.push(page1Container, page2Container);

      // Insert in DOM
      containers.forEach((container) => document.body.appendChild(container));

      // Wait images loading
      await Promise.all(containers.map((container) => this.ensureImagesLoaded(container)));
      await this.waitForRender(300);

      return containers;
    } catch (error) {
      this.cleanupContainers(containers);
      throw error;
    }
  }

  private createInvoicePage(
    sourceElement: HTMLElement,
    config: Required<PdfOptions>,
    pageNumber: number,
  ): HTMLElement {
    const container = this.createPageContainer(sourceElement, config, pageNumber);

    if (pageNumber === 1) {
      this.addSourceCopy(container, sourceElement, 1, config.copyLabels[0]);
      this.addPageSeparator(container);
      this.addSourceCopy(container, sourceElement, 2, config.copyLabels[1]);
    } else {
      this.addSourceCopy(container, sourceElement, 3, config.copyLabels[2]);
    }

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
