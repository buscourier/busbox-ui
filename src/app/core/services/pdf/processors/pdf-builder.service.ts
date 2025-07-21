import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

import { ImageFormat, PageFormat, PageOrientation, type PdfGenerationOptions } from '@shared/types';

export interface PdfBuilder {
  addPage(imageData: string, options: PdfGenerationOptions): Promise<void>;

  build(): Promise<Blob>;

  getPageCount(): number;
}

@Injectable({ providedIn: 'root' })
export class JsPdfBuilder implements PdfBuilder {
  private pdf?: jsPDF;
  private pageCount = 0;
  private isFirstPage = true;

  async addPage(imageData: string, options: PdfGenerationOptions): Promise<void> {
    if (!this.pdf) {
      this.initializePdf(options);
    }

    if (!this.isFirstPage) {
      this.pdf!.addPage();
    }

    await this.embedImageInPdf(imageData, options);
    this.pageCount++;
    this.isFirstPage = false;
  }

  async build(): Promise<Blob> {
    if (!this.pdf) {
      throw new Error('No PDF initialized');
    }

    const blob = this.pdf.output('blob');
    this.reset();
    return blob;
  }

  getPageCount(): number {
    return this.pageCount;
  }

  private initializePdf(options: PdfGenerationOptions): void {
    const orientation = options.orientation === PageOrientation.LANDSCAPE ? 'l' : 'p';
    const format = options.format || PageFormat.A4;

    this.pdf = new jsPDF(orientation, 'mm', format);
  }

  private async embedImageInPdf(imageData: string, options: PdfGenerationOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          const pdfWidth = this.pdf!.internal.pageSize.getWidth();
          const pdfHeight = this.pdf!.internal.pageSize.getHeight();
          const margin = 5;

          const { width, height, x, y } = this.calculateImageDimensions(
            img,
            pdfWidth,
            pdfHeight,
            margin,
          );

          const format = this.getJsPdfFormat(options.imageFormat);
          this.pdf!.addImage(imageData, format, x, y, width, height, undefined, 'FAST');

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for PDF'));
      };

      img.src = imageData;
    });
  }

  private calculateImageDimensions(
    img: HTMLImageElement,
    pdfWidth: number,
    pdfHeight: number,
    margin: number,
  ) {
    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

    let width = availableWidth;
    let height = (img.height * width) / img.width;

    if (height > availableHeight) {
      height = availableHeight;
      width = (img.width * height) / img.height;
    }

    const x = (pdfWidth - width) / 2;
    const y = (pdfHeight - height) / 2;

    return { width, height, x, y };
  }

  private getJsPdfFormat(imageFormat?: ImageFormat): string {
    switch (imageFormat) {
      case ImageFormat.JPEG:
        return 'JPEG';
      case ImageFormat.WEBP:
        return 'WEBP';
      default:
        return 'PNG';
    }
  }

  private reset(): void {
    this.pdf = undefined;
    this.pageCount = 0;
    this.isFirstPage = true;
  }
}
