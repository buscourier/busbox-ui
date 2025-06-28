import { Injectable } from '@angular/core';

import {
  PageOrientation,
  PdfGeneratorService,
  type PdfOptions,
} from '@core/services/pdf-generator.service';

@Injectable({
  providedIn: 'root',
})
export class TariffsGeneratorService extends PdfGeneratorService {
  protected override get defaultOptions(): Required<PdfOptions> {
    return {
      ...super.defaultOptions,
      filename: 'тарифы.pdf',
      orientation: PageOrientation.PORTRAIT,
    };
  }

  protected async createPageContainers(
    sourceElement: HTMLElement,
    config: Required<PdfOptions>,
  ): Promise<HTMLElement[]> {
    const containers: HTMLElement[] = [];

    try {
      const pageContainer = this.createPage(sourceElement, config, 1);

      containers.push(pageContainer);

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
    // container.style.filter = 'grayscale(100%)';

    this.addSourceElementCopy(container, sourceElement);

    return container;
  }
}
