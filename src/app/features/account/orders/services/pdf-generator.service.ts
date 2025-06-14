import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import type { OrderInfo } from '../types';

export interface PdfOptions {
  scale?: number;
  filename?: string;
  showProgress?: boolean;
  copyLabels?: string[];
  quality?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
}

export interface PdfGenerationResult {
  success: boolean;
  filename?: string;
  error?: string;
  pageCount?: number;
  fileSize?: number;
  blob?: Blob; // Добавляем Blob в результат
}

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  private readonly defaultOptions: Required<PdfOptions> = {
    scale: 2.5,
    filename: 'Накладная.pdf',
    showProgress: true,
    copyLabels: ['Отправитель', 'Получатель', 'Архив'],
    quality: 0.95,
    format: 'a4',
    orientation: 'portrait',
  };

  private loadingIndicatorId = 'pdf-loader';

  /**
   * Генерирует PDF накладной с тремя экземплярами
   */
  async generateInvoicePDF(
    sourceElement: HTMLElement,
    invoiceData: OrderInfo,
    options: Partial<PdfOptions> = {},
  ): Promise<PdfGenerationResult> {
    const config = { ...this.defaultOptions, ...options };

    try {
      this.validateInputs(sourceElement, invoiceData);

      if (config.showProgress) {
        this.showLoadingIndicator();
      }

      const containers = await this.createPageContainers(sourceElement, invoiceData, config);

      try {
        const pdfBlob = await this.generateMultiPagePDF(containers, config);

        return {
          success: true,
          filename: config.filename,
          pageCount: containers.length,
          fileSize: pdfBlob.size,
          blob: pdfBlob, // Возвращаем Blob в результате
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

  /**
   * Валидация входных параметров
   */
  private validateInputs(sourceElement: HTMLElement, invoiceData: OrderInfo): void {
    if (!sourceElement) {
      throw new Error('Исходный элемент не найден');
    }

    if (sourceElement.offsetWidth === 0 || sourceElement.offsetHeight === 0) {
      throw new Error('Исходный элемент имеет нулевые размеры');
    }

    if (!invoiceData?.order_id) {
      throw new Error('Некорректные данные накладной');
    }
  }

  /**
   * Создает все контейнеры страниц асинхронно
   */
  private async createPageContainers(
    sourceElement: HTMLElement,
    invoiceData: OrderInfo,
    config: Required<PdfOptions>,
  ): Promise<HTMLElement[]> {
    const containers: HTMLElement[] = [];

    try {
      // Создаем контейнеры для страниц
      const page1Container = this.createPageContainer(sourceElement, config, 1);
      const page2Container = this.createPageContainer(sourceElement, config, 2);

      containers.push(page1Container, page2Container);

      // Добавляем в DOM
      containers.forEach((container) => document.body.appendChild(container));

      // Ждем загрузки изображений в контейнерах
      await Promise.all(containers.map((container) => this.ensureImagesLoaded(container)));

      // Ждем рендеринга
      await this.waitForRender(300);

      return containers;
    } catch (error) {
      // Очищаем уже созданные контейнеры в случае ошибки
      this.cleanupContainers(containers);
      throw error;
    }
  }

  /**
   * Очистка контейнеров из DOM
   */
  private cleanupContainers(containers: HTMLElement[]): void {
    containers.forEach((container) => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
  }

  /**
   * Создает контейнер для одной страницы
   */
  private createPageContainer(
    sourceElement: HTMLElement,
    config: Required<PdfOptions>,
    pageNumber: number,
  ): HTMLElement {
    const container = document.createElement('div');

    // Устанавливаем уникальный ID для контейнера
    container.id = `pdf-container-page-${pageNumber}-${Date.now()}`;

    this.setupPageContainerStyles(container, pageNumber, config.format);

    if (pageNumber === 1) {
      this.addInvoiceCopy(container, sourceElement, 1, config.copyLabels[0]);
      this.addPageSeparator(container);
      this.addInvoiceCopy(container, sourceElement, 2, config.copyLabels[1]);
    } else {
      this.addInvoiceCopy(container, sourceElement, 3, config.copyLabels[2]);
    }

    return container;
  }

  /**
   * Настройка стилей контейнера страницы с поддержкой форматов
   */
  private setupPageContainerStyles(
    container: HTMLElement,
    pageNumber: number,
    format: 'a4' | 'letter',
  ): void {
    const dimensions =
      format === 'a4' ? { width: '210mm', height: '297mm' } : { width: '8.5in', height: '11in' };

    Object.assign(container.style, {
      position: 'absolute',
      left: '-9999px',
      top: `${(pageNumber - 1) * 3000}px`,
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

  /**
   * Добавляет копию накладной в контейнер
   */
  private addInvoiceCopy(
    container: HTMLElement,
    sourceElement: HTMLElement,
    copyNumber: number,
    label: string,
  ): void {
    const header = this.createCopyHeader(copyNumber, label);
    container.appendChild(header);

    const invoiceCopy = this.createInvoiceCopy(sourceElement);
    this.applyCopyStyles(invoiceCopy, copyNumber === 3); // Третий экземпляр на полную страницу
    container.appendChild(invoiceCopy);
  }

  /**
   * Добавляет разделитель между накладными
   */
  private addPageSeparator(container: HTMLElement): void {
    const separator = document.createElement('div');
    Object.assign(separator.style, {
      borderTop: '1px dashed #999',
      margin: '8mm 0',
      width: '100%',
      height: '1px',
    });
    container.appendChild(separator);
  }

  /**
   * Создает заголовок для копии накладной
   */
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

  /**
   * Создает копию накладной с очисткой от интерактивных элементов
   */
  private createInvoiceCopy(sourceElement: HTMLElement): HTMLElement {
    const copy = sourceElement.cloneNode(true) as HTMLElement;

    this.removeInteractiveElements(copy);
    this.applyPrintStyles(copy);

    return copy;
  }

  /**
   * Применяет специфичные стили к копии
   */
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

  /**
   * Улучшенное удаление интерактивных элементов
   */
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
      'a[href]:not([target="_blank"])', // Убираем ссылки кроме внешних
    ];

    selectorsToRemove.forEach((selector) => {
      try {
        const elements = element.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      } catch (error) {
        console.warn(`Не удалось удалить элементы по селектору: ${selector}`, error);
      }
    });

    // Убираем текст кнопок
    this.removeButtonContainers(element);

    // Заменяем input поля их значениями
    this.replaceInputsWithValues(element);
  }

  /**
   * Заменяет input поля их значениями для статичного отображения
   */
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

  /**
   * Удаляет контейнеры с кнопками
   */
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

  /**
   * Улучшенные стили для печати
   */
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

    this.styleTablesForPrint(element);
    this.styleCellsForPrint(element);
    this.applyBackgroundColors(element);
    this.optimizeImages(element);
    this.improveTextContrast(element);
  }

  /**
   * Улучшает контрастность текста
   */
  private improveTextContrast(element: HTMLElement): void {
    const grayTexts = element.querySelectorAll('.text-gray-500, .text-gray-600, .text-gray-400');
    grayTexts.forEach((el) => {
      Object.assign((el as HTMLElement).style, {
        color: '#333 !important',
      });
    });
  }

  /**
   * Стилизация таблиц для печати
   */
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

  /**
   * Стилизация ячеек для печати
   */
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

  /**
   * Применение фоновых цветов
   */
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

  /**
   * Оптимизация изображений
   */
  private optimizeImages(element: HTMLElement): void {
    const images = element.querySelectorAll('img');
    images.forEach((img) => {
      Object.assign((img as HTMLElement).style, {
        maxWidth: '100%',
        height: 'auto',
        imageRendering: 'crisp-edges',
        border: '1px solid #ccc',
      });

      // Обработка ошибок загрузки изображений
      (img as HTMLImageElement).onerror = () => {
        console.warn('Не удалось загрузить изображение:', img.src);
      };
    });
  }

  /**
   * Ожидание рендеринга с прогрессом
   */
  private async waitForRender(ms = 200): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Проверяем что все изображения загружены
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

  /**
   * Генерация PDF с возвратом Blob
   */
  private async generateMultiPagePDF(
    containers: HTMLElement[],
    options: Required<PdfOptions>,
  ): Promise<Blob> {
    const pdf = new jsPDF(options.orientation.charAt(0) as 'p' | 'l', 'mm', options.format);

    let isFirstPage = true;

    for (let i = 0; i < containers.length; i++) {
      const container = containers[i];

      try {
        const canvas = await html2canvas(container, {
          scale: options.scale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: container.scrollWidth,
          height: container.scrollHeight,
          logging: false,
          removeContainer: true,
          imageTimeout: 15000,
          // Убираем onclone - он не критичен для большинства случаев
        });

        if (canvas.width === 0 || canvas.height === 0) {
          throw new Error(`Canvas имеет нулевые размеры для страницы ${i + 1}`);
        }

        if (!isFirstPage) {
          pdf.addPage();
        }

        await this.addCanvasToPDF(pdf, canvas, options);
        isFirstPage = false;
      } catch (error) {
        console.error(`Ошибка при обработке страницы ${i + 1}:`, error);
        throw new Error(`Ошибка при создании страницы PDF: ${error}`);
      }
    }

    // Возвращаем Blob вместо сохранения файла
    const pdfBlob = pdf.output('blob');

    // Создаем ссылку для скачивания
    this.downloadBlob(pdfBlob, options.filename);

    return pdfBlob;
  }

  /**
   * Дополнительная обработка изображений перед созданием PDF (если потребуется)
   */
  private ensureImagesLoaded(container: HTMLElement): Promise<void> {
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
          // Перезагружаем если нужно
          if (!imgElement.src) {
            // imgElement.src = imgElement.src;
          }
        }
      });
    });

    return Promise.all(imagePromises).then(() => {
      console.log('images loaded');
    });
  }

  /**
   * Скачивание Blob как файла
   */
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

  /**
   * Создает URL для Blob объекта (для просмотра в PDF viewer)
   */
  createBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  /**
   * Освобождает URL объекта
   */
  revokeBlobUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * Добавляет canvas в PDF
   */
  private async addCanvasToPDF(
    pdf: jsPDF,
    canvas: HTMLCanvasElement,
    options: Required<PdfOptions>,
  ): Promise<void> {
    const imgData = canvas.toDataURL('image/jpeg', options.quality);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 5; // Уменьшенные отступы

    const availableWidth = pdfWidth - margin * 2;
    const availableHeight = pdfHeight - margin * 2;

    let finalWidth = availableWidth;
    let finalHeight = (canvas.height * finalWidth) / canvas.width;

    if (finalHeight > availableHeight) {
      finalHeight = availableHeight;
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }

    const x = (pdfWidth - finalWidth) / 2;
    const y = (pdfHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight, undefined, 'FAST');
  }

  /**
   * Улучшенный индикатор загрузки
   */
  private showLoadingIndicator(): void {
    if (document.getElementById(this.loadingIndicatorId)) {
      return; // Уже показан
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

  /**
   * Скрытие индикатора загрузки
   */
  private hideLoadingIndicator(): void {
    const loader = document.getElementById(this.loadingIndicatorId);
    if (loader) {
      loader.remove();
    }
  }
}
