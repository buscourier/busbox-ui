import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TUI_IS_MOBILE } from '@taiga-ui/cdk';
import { type TuiPdfViewerOptions, TuiPdfViewerService } from '@taiga-ui/kit';
import { Observable } from 'rxjs';

import type { OrderInfo } from '../types';

import { PdfGeneratorService, type PdfOptions } from './pdf-generator.service';

export interface PdfViewerOptions extends Partial<TuiPdfViewerOptions> {
  autoDownload?: boolean;
  downloadLabel?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PdfViewerService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly pdfService = inject(TuiPdfViewerService);
  private readonly pdfGenerator = inject(PdfGeneratorService);
  private readonly isMobile = inject(TUI_IS_MOBILE);

  private activeBlobUrls = new Set<string>();

  /**
   * Генерирует PDF и показывает его в Taiga UI PDF Viewer
   */
  generateAndShowPdf(
    sourceElement: HTMLElement,
    invoiceData: OrderInfo,
    pdfOptions: Partial<PdfOptions> = {},
    viewerOptions: PdfViewerOptions = {},
  ): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.pdfGenerator
        .generateInvoicePDF(sourceElement, invoiceData, pdfOptions)
        .then((result) => {
          if (!result.success || !result.blob) {
            subscriber.error(new Error(result.error || 'Ошибка генерации PDF'));
            return;
          }

          // Создаем Blob URL для просмотра
          const blobUrl = this.pdfGenerator.createBlobUrl(result.blob);
          this.activeBlobUrls.add(blobUrl);

          // Показываем PDF в viewer
          this.showPdfInViewer(blobUrl, invoiceData, viewerOptions).subscribe({
            next: () => subscriber.next(),
            error: (error) => {
              this.cleanupBlobUrl(blobUrl);
              subscriber.error(error);
            },
            complete: () => {
              // Очищаем URL после закрытия viewer
              this.cleanupBlobUrl(blobUrl);
              subscriber.complete();
            },
          });
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }

  /**
   * Показывает PDF в Taiga UI PDF Viewer
   */
  private showPdfInViewer(
    pdfUrl: string,
    invoiceData: OrderInfo,
    options: PdfViewerOptions = {},
  ): Observable<void> {
    return new Observable<void>((subscriber) => {
      const defaultOptions: TuiPdfViewerOptions = {
        data: undefined,
        label: `Накладная №${invoiceData.order_id}`,
        actions: this.createViewerActions(pdfUrl, options),
      };

      const viewerConfig = { ...defaultOptions, ...options };

      // Создаем безопасный URL для просмотра
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.isMobile ? this.getMobileViewerUrl(pdfUrl) : pdfUrl,
      );

      // Подписываемся на открытие PDF viewer
      this.pdfService.open(safeUrl, viewerConfig).subscribe({
        next: (result) => {
          // TuiPdfViewerService может возвращать разные типы результатов
          console.log('PDF viewer opened successfully', result);
          subscriber.next();
        },
        error: (error) => {
          console.error('Error opening PDF viewer:', error);
          subscriber.error(error);
        },
        complete: () => {
          console.log('PDF viewer closed');
          subscriber.complete();
        },
      });
    });
  }

  /**
   * Создает действия для PDF viewer
   */
  private createViewerActions(
    pdfUrl: string,
    options: PdfViewerOptions,
  ): {
    text: string;
    click: () => void;
  }[] {
    const actions: { text: string; click: () => void }[] = [];

    // Действие скачивания
    if (options.autoDownload !== false) {
      actions.push({
        text: options.downloadLabel || 'Скачать PDF',
        click: () => this.downloadPdfFromUrl(pdfUrl),
      });
    }

    // Действие печати (если поддерживается браузером)
    if (this.isPrintSupported()) {
      actions.push({
        text: 'Печать',
        click: () => this.printPdf(pdfUrl),
      });
    }

    return actions;
  }

  /**
   * Скачивает PDF по URL
   */
  private downloadPdfFromUrl(url: string): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `Накладная_${timestamp}.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Печатает PDF (открывает в новой вкладке для печати)
   */
  private printPdf(url: string): void {
    try {
      const printWindow = window.open(url, '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.onload = () => {
          // Небольшая задержка для загрузки PDF
          setTimeout(() => {
            printWindow.print();
          }, 1000);
        };

        // Fallback если onload не сработает
        setTimeout(() => {
          if (printWindow && !printWindow.closed) {
            printWindow.print();
          }
        }, 2000);
      } else {
        console.warn('Не удалось открыть окно для печати. Возможно заблокированы popup.');
      }
    } catch (error) {
      console.error('Ошибка при печати PDF:', error);
    }
  }

  /**
   * Проверяет поддержку печати
   */
  private isPrintSupported(): boolean {
    return !this.isMobile && typeof window !== 'undefined' && typeof window.open === 'function';
  }

  /**
   * Создает URL для мобильного просмотра
   */
  private getMobileViewerUrl(pdfUrl: string): string {
    // Для мобильных устройств можно использовать внешний viewer
    // Но blob URL не будет доступен извне, поэтому возвращаем тот же URL
    // В production можно загружать на сервер и использовать внешний viewer
    return pdfUrl;
  }

  /**
   * Очищает URL Blob объекта
   */
  private cleanupBlobUrl(url: string): void {
    if (this.activeBlobUrls.has(url)) {
      this.pdfGenerator.revokeBlobUrl(url);
      this.activeBlobUrls.delete(url);
      console.log('Blob URL cleaned up:', url.substring(0, 50) + '...');
    }
  }

  /**
   * Очищает все активные URL при уничтожении сервиса
   */
  cleanup(): void {
    console.log(`Cleaning up ${this.activeBlobUrls.size} blob URLs`);
    this.activeBlobUrls.forEach((url) => {
      this.pdfGenerator.revokeBlobUrl(url);
    });
    this.activeBlobUrls.clear();
  }

  /**
   * Генерирует PDF и сразу скачивает без показа viewer
   */
  generateAndDownloadPdf(
    sourceElement: HTMLElement,
    invoiceData: OrderInfo,
    pdfOptions: Partial<PdfOptions> = {},
  ): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.pdfGenerator
        .generateInvoicePDF(sourceElement, invoiceData, pdfOptions)
        .then((result) => {
          if (!result.success || !result.blob) {
            subscriber.error(new Error(result.error || 'Ошибка генерации PDF'));
            return;
          }

          // Скачиваем файл
          const url = this.pdfGenerator.createBlobUrl(result.blob);
          this.downloadPdfFromUrl(url);

          // Очищаем URL
          setTimeout(() => {
            this.pdfGenerator.revokeBlobUrl(url);
          }, 1000);

          subscriber.next();
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }
}
