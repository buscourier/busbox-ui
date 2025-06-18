import { Injectable } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export interface PdfOptions {
  scale?: number;
  filename?: string;
  showProgress?: boolean;
  copyLabels?: string[];
  quality?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  imageFormat?: 'png' | 'jpeg' | 'webp';
  pixelRatio?: number;
  skipFonts?: boolean;
  includeQueryParams?: boolean;
}

export interface PdfGenerationResult {
  success: boolean;
  filename?: string;
  error?: string;
  pageCount?: number;
  fileSize?: number;
  blob?: Blob;
}

@Injectable({
  providedIn: 'root',
})
export abstract class PdfGeneratorService {
  protected get defaultOptions(): Required<PdfOptions> {
    return {
      scale: 2.5,
      filename: 'document.pdf',
      showProgress: true,
      copyLabels: ['Копия 1', 'Копия 2', 'Копия 3'],
      quality: 0.95,
      format: 'a4',
      orientation: 'portrait',
      imageFormat: 'png',
      pixelRatio: window.devicePixelRatio || 1,
      skipFonts: false,
      includeQueryParams: false,
    };
  }

  private loadingIndicatorId = 'pdf-loader';

  protected get isPortraitOrientation() {
    return this.defaultOptions.orientation === 'portrait';
  }

  async generatePDF<T>(
    sourceElement: HTMLElement,
    data: T,
    options: Partial<PdfOptions> = {},
  ): Promise<PdfGenerationResult> {
    const config = { ...this.defaultOptions, ...options };

    try {
      this.validateInputs(sourceElement, data);

      if (config.showProgress) {
        this.showLoadingIndicator();
      }

      const containers = await this.createPageContainers(sourceElement, data, config);

      try {
        const pdfBlob = await this.generateMultiPagePDF(containers, config);
        return {
          success: true,
          filename: config.filename,
          pageCount: containers.length,
          fileSize: pdfBlob.size,
          blob: pdfBlob,
        };
      } finally {
        this.cleanupContainers(containers);
      }
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    } finally {
      if (config.showProgress) {
        this.hideLoadingIndicator();
      }
    }
  }

  protected abstract createPageContainers(
    sourceElement: HTMLElement,
    data: unknown,
    config: Required<PdfOptions>,
  ): Promise<HTMLElement[]>;

  protected validateInputs(sourceElement: HTMLElement, data: unknown): void {
    if (!sourceElement) {
      throw new Error('Исходный элемент не найден');
    }

    if (sourceElement.offsetWidth === 0 || sourceElement.offsetHeight === 0) {
      throw new Error('Исходный элемент имеет нулевые размеры');
    }

    if (!data) {
      throw new Error('Некорректные данные документа');
    }
  }

  protected cleanupContainers(containers: HTMLElement[]): void {
    containers.forEach((container) => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
  }

  protected createPageContainer(
    sourceElement: HTMLElement,
    config: Required<PdfOptions>,
    pageNumber: number,
  ): HTMLElement {
    const container = document.createElement('div');
    container.id = `pdf-container-page-${pageNumber}-${Date.now()}`;
    this.setupPageContainerStyles(container, pageNumber, config.format);
    return container;
  }

  private setupPageContainerStyles(
    container: HTMLElement,
    pageNumber: number,
    format: 'a4' | 'letter',
  ): void {
    const dimensions =
      format === 'a4' ? { width: '210mm', height: '297mm' } : { width: '8.5in', height: '11in' };

    Object.assign(container.style, {
      ...dimensions,
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      padding: '8mm',
      boxSizing: 'border-box',
      zIndex: '-1',
      overflow: 'hidden',
    });
  }

  protected addSourceElementCopy(
    container: HTMLElement,
    sourceElement: HTMLElement,
    copyNumber?: number,
    label?: string,
  ): void {
    const item = document.createElement('div');

    if (copyNumber && label) {
      const header = this.createCopyHeader(copyNumber, label);
      item.appendChild(header);
    }

    const copy = this.createSourceElementCopy(sourceElement);
    // this.applyCopyStyles(copy, copyNumber === 3);
    item.appendChild(copy);

    container.appendChild(item);
  }

  protected addPageSeparator(container: HTMLElement): void {
    const separator = document.createElement('div');
    Object.assign(separator.style, {
      borderTop: '1px dashed #999',
      margin: '8mm 0',
      width: '100%',
      height: '1px',
    });
    container.appendChild(separator);
  }

  private createCopyHeader(copyNumber: number, label: string): HTMLElement {
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
    return header;
  }

  private createSourceElementCopy(sourceElement: HTMLElement): HTMLElement {
    const copy = sourceElement.cloneNode(true) as HTMLElement;
    this.removeInteractiveElements(copy);
    // this.applyPrintStyles(copy);
    return copy;
  }

  private applyCopyStyles(copy: HTMLElement, isFullPage = false): void {
    const scale = isFullPage ? 1 : 0.95;

    Object.assign(copy.style, {
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
      marginBottom: isFullPage ? '0' : '2mm',
      width: '100%',
      height: isFullPage ? 'auto' : '120mm',
      overflow: 'hidden',
      pageBreakInside: 'avoid',
    });
  }

  private removeInteractiveElements(element: HTMLElement): void {
    const selectorsToRemove = [
      'button:not([disabled])',
      'input[type="button"]',
      'input[type="submit"]',
      '.print\\:invisible',
      '.print\\:h-0',
      '.no-print',
      '[tuiButton]',
      '.space-x-2',
      '[type="button"]:not([disabled])',
      'a[href]:not([target="_blank"])',
    ];

    selectorsToRemove.forEach((selector) => {
      try {
        const elements = element.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      } catch (error) {
        console.warn(`Не удалось удалить элементы по селектору: ${selector}`, error);
      }
    });

    this.removeButtonContainers(element);
    // this.replaceInputsWithValues(element);
  }

  private replaceInputsWithValues(element: HTMLElement): void {
    const inputs = element.querySelectorAll('input[type="text"], input[type="checkbox"]');
    inputs.forEach((input) => {
      const inputEl = input as HTMLInputElement;
      const span = document.createElement('span');

      if (inputEl.type === 'checkbox') {
        span.textContent = inputEl.checked ? '☑' : '☐';
      } else {
        span.textContent = inputEl.value || '';
      }

      Object.assign(span.style, {
        display: 'inline-block',
        border: '1px solid #000',
        padding: '1px 3px',
        minWidth: '20px',
        minHeight: '12px',
      });

      inputEl.parentNode?.replaceChild(span, inputEl);
    });
  }

  private removeButtonContainers(element: HTMLElement): void {
    const buttonTexts = ['Напечатать', 'Закрыть', 'Сохранить', 'Отменить'];
    const allDivs = element.querySelectorAll('div');

    allDivs.forEach((div) => {
      const text = div.textContent?.trim() || '';
      if (buttonTexts.some((btnText) => text.includes(btnText))) {
        div.remove();
      }
    });
  }

  private applyPrintStyles(element: HTMLElement): void {
    Object.assign(element.style, {
      width: '100%',
      fontSize: '11px',
      lineHeight: '1.2',
      color: '#000',
      backgroundColor: '#fff',
      fontFamily: 'Arial, Helvetica, sans-serif',
      webkitPrintColorAdjust: 'exact',
      colorAdjust: 'exact',
    });

    // this.styleTablesForPrint(element);
    // this.styleCellsForPrint(element);
    // this.applyBackgroundColors(element);
    // this.optimizeImages(element);
    // this.improveTextContrast(element);
  }

  private improveTextContrast(element: HTMLElement): void {
    const grayTexts = element.querySelectorAll('.text-gray-500, .text-gray-600, .text-gray-400');
    grayTexts.forEach((el) => {
      Object.assign((el as HTMLElement).style, {
        color: '#333 !important',
      });
    });
  }

  private styleTablesForPrint(element: HTMLElement): void {
    const tables = element.querySelectorAll('table');
    tables.forEach((table) => {
      Object.assign((table as HTMLElement).style, {
        borderCollapse: 'collapse',
        width: '100%',
        fontSize: '10px',
        border: '2px solid #000',
        pageBreakInside: 'auto',
      });
    });
  }

  private styleCellsForPrint(element: HTMLElement): void {
    const cells = element.querySelectorAll('td, th');
    cells.forEach((cell) => {
      Object.assign((cell as HTMLElement).style, {
        border: '1px solid #000',
        padding: '3px',
        verticalAlign: 'top',
        fontSize: '9px',
        lineHeight: '1.1',
        wordWrap: 'break-word',
        pageBreakInside: 'avoid',
      });
    });
  }

  private applyBackgroundColors(element: HTMLElement): void {
    const grayBgElements = element.querySelectorAll('.bg-zinc-400, .bg-gray-400, .bg-gray-100');
    grayBgElements.forEach((el) => {
      Object.assign((el as HTMLElement).style, {
        backgroundColor: '#e5e5e5 !important',
        color: '#000 !important',
        fontWeight: 'bold',
        webkitPrintColorAdjust: 'exact',
        colorAdjust: 'exact',
      });
    });
  }

  private optimizeImages(element: HTMLElement): void {
    const images = element.querySelectorAll('img');
    images.forEach((img) => {
      Object.assign((img as HTMLElement).style, {
        maxWidth: '100%',
        height: 'auto',
        imageRendering: 'crisp-edges',
        border: '1px solid #ccc',
      });

      (img as HTMLImageElement).onerror = () => {
        console.warn('Не удалось загрузить изображение:', img.src);
      };
    });
  }

  protected async waitForRender(ms = 200): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const images = document.querySelectorAll('img');
        const imagePromises = Array.from(images).map((img) => {
          return new Promise((resolve) => {
            if ((img as HTMLImageElement).complete) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            }
          });
        });

        Promise.all(imagePromises).then(() => resolve());
      }, ms);
    });
  }

  protected async generateMultiPagePDF(
    containers: HTMLElement[],
    options: Required<PdfOptions>,
  ): Promise<Blob> {
    const pdf = new jsPDF(options.orientation.charAt(0) as 'p' | 'l', 'mm', options.format);

    let isFirstPage = true;

    for (let i = 0; i < containers.length; i++) {
      const container = containers[i];

      try {
        await this.ensureImagesLoaded(container);

        const dataUrl = await this.containerToDataUrl(container, options);

        if (!dataUrl) {
          throw new Error(`Не удалось создать изображение для страницы ${i + 1}`);
        }

        if (!isFirstPage) {
          pdf.addPage();
        }

        await this.addImageToPDF(pdf, dataUrl, options);
        isFirstPage = false;
      } catch (error) {
        console.error(`Ошибка при обработке страницы ${i + 1}:`, error);
        throw new Error(`Ошибка при создании страницы PDF: ${error}`);
      }
    }

    const pdfBlob = pdf.output('blob');
    this.downloadBlob(pdfBlob, options.filename);
    return pdfBlob;
  }

  private async containerToDataUrl(
    container: HTMLElement,
    options: Required<PdfOptions>,
  ): Promise<string> {
    const htmlToImageOptions = {
      width: container.scrollWidth * options.scale,
      height: container.scrollHeight * options.scale,
      style: {
        transform: `scale(${options.scale})`,
        transformOrigin: 'top left',
        width: container.scrollWidth + 'px',
        height: container.scrollHeight + 'px',
      },
      quality: options.quality,
      pixelRatio: options.pixelRatio,
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: options.skipFonts,
      includeQueryParams: options.includeQueryParams,
      filter: (node: Node) => {
        // Filter unnecessary nodes
        if (node instanceof Element && node.classList) {
          return !node.classList.contains('no-print');
        }
        return true;
      },
      onCloneDocument: (document: Document, node: HTMLElement) => {
        console.log('node', node);
        const styles = document.createElement('style');
        styles.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        `;
        document.head.appendChild(styles);
      },
    };

    try {
      let dataUrl: string;

      switch (options.imageFormat) {
        case 'jpeg':
          dataUrl = await htmlToImage.toJpeg(container, htmlToImageOptions);
          break;
        case 'webp':
          if (this.isWebPSupported()) {
            // dataUrl = await htmlToImage.toWebp?.(container, htmlToImageOptions) ||
            //   await htmlToImage.toPng(container, htmlToImageOptions);

            dataUrl = await htmlToImage.toPng(container, htmlToImageOptions);
          } else {
            dataUrl = await htmlToImage.toPng(container, htmlToImageOptions);
          }
          break;
        default:
          dataUrl = await htmlToImage.toPng(container, htmlToImageOptions);
      }

      return dataUrl;
    } catch (error) {
      console.error('Ошибка html-to-image:', error);

      try {
        console.log('Попытка fallback с базовыми настройками...');
        return await htmlToImage.toPng(container, {
          quality: options.quality,
          backgroundColor: '#ffffff',
          cacheBust: true,
        });
      } catch (fallbackError) {
        console.error('Fallback тоже не сработал:', fallbackError);
        throw new Error('Не удалось создать изображение элемента');
      }
    }
  }

  /**
   * Проверяет поддержку WebP
   */
  private isWebPSupported(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const dataURL = canvas.toDataURL('image/webp');
    return dataURL.indexOf('data:image/webp') === 0;
  }

  protected ensureImagesLoaded(container: HTMLElement): Promise<void> {
    const images = container.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        const imgElement = img as HTMLImageElement;
        if (imgElement.complete && imgElement.naturalWidth > 0) {
          resolve();
        } else {
          imgElement.onload = () => resolve();
          imgElement.onerror = () => {
            console.warn('Изображение не загрузилось:', imgElement.src);
            resolve(); // Продолжаем даже если изображение не загрузилось
          };

          setTimeout(() => {
            console.warn('Timeout для изображения:', imgElement.src);
            resolve();
          }, 5000);
        }
      });
    });

    return Promise.all(imagePromises).then(() => {
      console.log(`Загружено ${images.length} изображений`);
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

  private async addImageToPDF(
    pdf: jsPDF,
    dataUrl: string,
    options: Required<PdfOptions>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const margin = 5;

          const availableWidth = pdfWidth - margin * 2;
          const availableHeight = pdfHeight - margin * 2;

          let finalWidth = availableWidth;
          let finalHeight = (img.height * finalWidth) / img.width;

          if (finalHeight > availableHeight) {
            finalHeight = availableHeight;
            finalWidth = (img.width * finalHeight) / img.height;
          }

          const x = (pdfWidth - finalWidth) / 2;
          const y = (pdfHeight - finalHeight) / 2;

          let format: 'JPEG' | 'PNG' | 'WEBP' = 'PNG';
          if (options.imageFormat === 'jpeg') format = 'JPEG';
          else if (options.imageFormat === 'webp') format = 'WEBP';

          pdf.addImage(dataUrl, format, x, y, finalWidth, finalHeight, undefined, 'FAST');

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Не удалось загрузить изображение в PDF'));
      };

      img.src = dataUrl;
    });
  }

  protected addGridSeparators(container: HTMLElement): void {
    const vSeparator = document.createElement('div');
    Object.assign(vSeparator.style, {
      position: 'absolute',
      left: '50%',
      top: '0',
      bottom: '0',
      width: '1px',
      border: '1px dashed #e6e6e6',
      transform: 'translateX(-50%)',
    });

    const hSeparator = document.createElement('div');
    Object.assign(hSeparator.style, {
      position: 'absolute',
      top: '50%',
      left: '0',
      right: '0',
      height: '1px',
      border: '1px dashed #e6e6e6',
      transform: 'translateY(-50%)',
    });

    container.appendChild(vSeparator);
    container.appendChild(hSeparator);
  }

  protected showLoadingIndicator(): void {
    if (document.getElementById(this.loadingIndicatorId)) {
      return;
    }

    const loader = document.createElement('div');
    loader.id = this.loadingIndicatorId;
    loader.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 20px; height: 20px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <span>Создание PDF...</span>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    Object.assign(loader.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '20px 30px',
      borderRadius: '8px',
      zIndex: '10000',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
    });

    document.body.appendChild(loader);
  }

  protected hideLoadingIndicator(): void {
    const loader = document.getElementById(this.loadingIndicatorId);
    if (loader) {
      loader.remove();
    }
  }
}
