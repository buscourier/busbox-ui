import { Injectable } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export const PageFormat = {
  A4: 'a4',
  LETTER: 'letter',
} as const;

export type PageFormat = (typeof PageFormat)[keyof typeof PageFormat];

export const PageOrientation = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
} as const;

export type PageOrientation = (typeof PageOrientation)[keyof typeof PageOrientation];

export const ImageFormat = {
  PNG: 'png',
  JPEG: 'jpeg',
  WEBP: 'webp',
} as const;

export type ImageFormat = (typeof ImageFormat)[keyof typeof ImageFormat];

export const JsPdfFormat = {
  JPEG: 'JPEG',
  PNG: 'PNG',
  WEBP: 'WEBP',
} as const;

export type JsPdfFormat = (typeof JsPdfFormat)[keyof typeof JsPdfFormat];

export interface PdfOptions {
  scale?: number;
  filename?: string;
  showProgress?: boolean;
  copyLabels?: string[];
  quality?: number;
  format?: PageFormat;
  orientation?: PageOrientation;
  imageFormat?: ImageFormat;
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
      format: PageFormat.A4,
      orientation: PageOrientation.PORTRAIT,
      imageFormat: ImageFormat.PNG,
      pixelRatio: window.devicePixelRatio || 1,
      skipFonts: true,
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
    format: PageFormat,
  ): void {
    const dimensions =
      format === PageFormat.A4
        ? { width: '210mm', height: '297mm' }
        : { width: '8.5in', height: '11in' };

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
    return copy;
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
    this.replaceInputsWithValues(element);
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
        fontSize: '24px',
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
        case ImageFormat.JPEG:
          dataUrl = await htmlToImage.toJpeg(container, htmlToImageOptions);
          break;
        case ImageFormat.WEBP:
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

          let format: JsPdfFormat = JsPdfFormat.PNG;
          if (options.imageFormat === ImageFormat.JPEG) format = JsPdfFormat.JPEG;
          else if (options.imageFormat === ImageFormat.WEBP) format = JsPdfFormat.WEBP;

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
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-black opacity-90 text-sm rounded-lg px-7 py-5 flex items-center gap-2.5 text-white">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Создание PDF...</span>
        </div>
      </div>`;

    document.body.appendChild(loader);
  }

  protected hideLoadingIndicator(): void {
    const loader = document.getElementById(this.loadingIndicatorId);
    if (loader) {
      loader.remove();
    }
  }
}
