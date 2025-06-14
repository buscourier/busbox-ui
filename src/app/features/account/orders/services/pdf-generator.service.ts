import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import type { OrderInfo } from '../types';

export interface PdfOptions {
  scale?: number;
  filename?: string;
  showProgress?: boolean;
  copyLabels?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  private defaultOptions: PdfOptions = {
    scale: 2,
    filename: 'Накладная.pdf',
    showProgress: true,
    copyLabels: ['Отправитель', 'Получатель', 'Архив'],
  };

  /**
   * Генерирует PDF накладной с тремя экземплярами
   * @param sourceElement - HTML элемент для конвертации
   * @param invoiceData - данные накладной
   * @param options - настройки генерации
   */
  async generateInvoicePDF(
    sourceElement: HTMLElement,
    invoiceData: OrderInfo,
    options: Partial<PdfOptions> = {},
  ): Promise<void> {
    const config = { ...this.defaultOptions, ...options };

    // Валидация входных данных
    if (!sourceElement || sourceElement.offsetWidth === 0) {
      throw new Error('Некорректный элемент для генерации PDF');
    }

    try {
      // Создаем временный контейнер с копиями
      const tempContainer = this.createInvoiceContainer(sourceElement, invoiceData, config);
      document.body.appendChild(tempContainer);

      try {
        // Даем время на рендеринг
        await this.waitForRender();

        // Генерируем PDF
        await this.generatePDFFromContainer(tempContainer, config);
      } finally {
        // Обязательно очищаем DOM
        document.body.removeChild(tempContainer);
      }
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
      throw new Error('Не удалось создать PDF. Попробуйте еще раз.');
    }
  }

  /**
   * Создает контейнер с тремя копиями накладной
   */
  private createInvoiceContainer(
    sourceElement: HTMLElement,
    invoiceData: OrderInfo,
    options: PdfOptions,
  ): HTMLElement {
    const container = document.createElement('div');
    this.setupContainerStyles(container);

    // Создаем копии согласно меткам
    options.copyLabels?.forEach((label, index) => {
      // Заголовок экземпляра
      const header = this.createCopyHeader(index + 1, label);
      container.appendChild(header);

      // Копия накладной
      const invoiceCopy = this.createInvoiceCopy(sourceElement);
      this.applyCopyStyles(invoiceCopy, index, options.copyLabels!.length);
      container.appendChild(invoiceCopy);

      // Разделитель между копиями (кроме последней)
      if (index < options.copyLabels!.length - 1) {
        const separator = this.createSeparator();
        container.appendChild(separator);
      }
    });

    return container;
  }

  /**
   * Настройка стилей основного контейнера
   */
  private setupContainerStyles(container: HTMLElement): void {
    Object.assign(container.style, {
      position: 'absolute',
      left: '-9999px', // Скрываем за пределами экрана
      top: '0',
      width: '210mm', // A4 ширина
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '10px',
      padding: '10mm',
      boxSizing: 'border-box',
    });
  }

  /**
   * Создает заголовок для копии накладной
   */
  private createCopyHeader(copyNumber: number, label: string): HTMLElement {
    const header = document.createElement('div');
    Object.assign(header.style, {
      textAlign: 'center',
      fontWeight: 'bold',
      marginBottom: '5mm',
      fontSize: '12px',
      color: '#000',
    });
    header.textContent = `ЭКЗЕМПЛЯР ${copyNumber} (${label})`;
    return header;
  }

  /**
   * Создает пунктирный разделитель между копиями
   */
  private createSeparator(): HTMLElement {
    const separator = document.createElement('div');
    Object.assign(separator.style, {
      borderTop: '2px dashed #ccc',
      margin: '8mm 0',
      width: '100%',
    });
    return separator;
  }

  /**
   * Создает копию накладной с очисткой от интерактивных элементов
   */
  private createInvoiceCopy(sourceElement: HTMLElement): HTMLElement {
    const copy = sourceElement.cloneNode(true) as HTMLElement;

    // Удаляем все интерактивные элементы
    this.removeInteractiveElements(copy);

    // Применяем стили для печати
    this.applyPrintStyles(copy);

    return copy;
  }

  /**
   * Применяет специфичные стили к копии
   */
  private applyCopyStyles(copy: HTMLElement, index: number, totalCopies: number): void {
    Object.assign(copy.style, {
      transform: 'scale(0.8)', // Уменьшаем для экономии места
      transformOrigin: 'top center',
      marginBottom: index < totalCopies - 1 ? '10mm' : '0',
    });
  }

  /**
   * Удаляет все интерактивные и ненужные для печати элементы
   */
  private removeInteractiveElements(element: HTMLElement): void {
    const selectorsToRemove = [
      'button',
      '.print\\:invisible',
      '[tuiButton]',
      '.print\\:h-0',
      'input[type="button"]',
      'input[type="submit"]',
      '.no-print',
    ];

    selectorsToRemove.forEach((selector) => {
      try {
        const elements = element.querySelectorAll(selector);
        elements.forEach((el) => el.remove());
      } catch (error) {
        // Игнорируем ошибки с некорректными селекторами
        console.warn(`Не удалось удалить элементы по селектору: ${selector}`, error);
      }
    });
  }

  /**
   * Применяет стили оптимизированные для печати
   */
  private applyPrintStyles(element: HTMLElement): void {
    // Основные стили элемента
    Object.assign(element.style, {
      width: '100%',
      fontSize: '10px',
      lineHeight: '1.2',
      color: '#000',
      backgroundColor: '#fff',
    });

    // Оптимизация таблиц для печати
    this.styleTablesForPrint(element);

    // Оптимизация ячеек для печати
    this.styleCellsForPrint(element);

    // Применение фоновых цветов
    this.applyBackgroundColors(element);
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
        fontSize: '9px',
      });
    });
  }

  /**
   * Стилизация ячеек таблиц для печати
   */
  private styleCellsForPrint(element: HTMLElement): void {
    const cells = element.querySelectorAll('td, th');
    cells.forEach((cell) => {
      Object.assign((cell as HTMLElement).style, {
        border: '1px solid #000',
        padding: '2px',
        verticalAlign: 'top',
        fontSize: '9px',
        lineHeight: '1.1',
      });
    });
  }

  /**
   * Применение фоновых цветов для печати
   */
  private applyBackgroundColors(element: HTMLElement): void {
    // Серые ячейки заголовков
    const grayBgElements = element.querySelectorAll('.bg-zinc-400, .bg-gray-400');
    grayBgElements.forEach((el) => {
      Object.assign((el as HTMLElement).style, {
        backgroundColor: '#e0e0e0 !important',
        color: '#000',
        fontWeight: 'bold',
      });
    });
  }

  /**
   * Пауза для корректного рендеринга DOM
   */
  private waitForRender(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  /**
   * Генерирует PDF из подготовленного контейнера
   */
  private async generatePDFFromContainer(
    container: HTMLElement,
    options: PdfOptions,
  ): Promise<void> {
    try {
      // Создание canvas с высоким качеством
      const canvas = await html2canvas(container, {
        scale: options.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: container.scrollWidth,
        height: container.scrollHeight,
        logging: false,
      });

      console.log('Canvas размеры:', canvas.width, 'x', canvas.height);

      // Проверка корректности canvas
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas имеет нулевые размеры');
      }

      // Создание и настройка PDF
      await this.createPDFFromCanvas(canvas, options);
    } catch (canvasError) {
      console.error('Ошибка html2canvas:', canvasError);
      throw new Error('Ошибка при создании изображения для PDF');
    }
  }

  /**
   * Создает PDF файл из canvas
   */
  private async createPDFFromCanvas(canvas: HTMLCanvasElement, options: PdfOptions): Promise<void> {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Расчет размеров для размещения на страницах A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Добавляем первую страницу
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Добавляем дополнительные страницы при необходимости
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Сохранение файла
    pdf.save(options.filename!);
    console.log(`PDF сохранен: ${options.filename}`);
  }
}
