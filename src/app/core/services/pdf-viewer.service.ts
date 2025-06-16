import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TUI_IS_MOBILE } from '@taiga-ui/cdk';
import { type TuiPdfViewerOptions, TuiPdfViewerService } from '@taiga-ui/kit';
import { Observable } from 'rxjs';

export interface PdfViewerOptions extends Partial<TuiPdfViewerOptions> {
  autoDownload?: boolean;
  downloadLabel?: string;
  printSupport?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PdfViewerService {
  protected readonly sanitizer = inject(DomSanitizer);
  protected readonly pdfService = inject(TuiPdfViewerService);
  protected readonly isMobile = inject(TUI_IS_MOBILE);

  private activeBlobUrls = new Set<string>();

  /**
   * Показывает готовый PDF в Viewer
   */
  showPdf(pdfUrl: string, label: string, options: PdfViewerOptions = {}): Observable<void> {
    return new Observable<void>((subscriber) => {
      const viewerConfig: TuiPdfViewerOptions = {
        data: undefined,
        label,
        actions: this.createViewerActions(pdfUrl, options),
        ...options,
      };

      const safeUrl = this.createSafeUrl(pdfUrl);

      this.pdfService.open(safeUrl, viewerConfig).subscribe({
        next: (result) => {
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
   * Показывает PDF из Blob
   */
  showPdfFromBlob(blob: Blob, label: string, options: PdfViewerOptions = {}): Observable<void> {
    return new Observable<void>((subscriber) => {
      const blobUrl = this.createBlobUrl(blob);
      this.activeBlobUrls.add(blobUrl);

      this.showPdf(blobUrl, label, options).subscribe({
        next: () => subscriber.next(),
        error: (error) => {
          this.cleanupBlobUrl(blobUrl);
          subscriber.error(error);
        },
        complete: () => {
          this.cleanupBlobUrl(blobUrl);
          subscriber.complete();
        },
      });
    });
  }

  /**
   * Скачивает PDF по URL
   */
  downloadPdf(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Скачивает PDF из Blob
   */
  downloadPdfFromBlob(blob: Blob, filename: string): void {
    const url = this.createBlobUrl(blob);
    this.downloadPdf(url, filename);

    // Очищаем URL через небольшую задержку
    setTimeout(() => this.revokeBlobUrl(url), 1000);
  }

  /**
   * Печать PDF
   */
  printPdf(url: string): void {
    if (!this.isPrintSupported()) {
      console.warn('Печать не поддерживается на данном устройстве');
      return;
    }

    try {
      const printWindow = window.open(url, '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => printWindow.print(), 1000);
        };

        // Fallback
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
   * Управление Blob URLs
   */
  createBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  revokeBlobUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * Очистка всех активных URLs
   */
  cleanup(): void {
    console.log(`Cleaning up ${this.activeBlobUrls.size} blob URLs`);
    this.activeBlobUrls.forEach((url) => this.revokeBlobUrl(url));
    this.activeBlobUrls.clear();
  }

  /**
   * Создает безопасный URL для просмотра
   */
  protected createSafeUrl(pdfUrl: string) {
    const finalUrl = this.isMobile ? this.getMobileViewerUrl(pdfUrl) : pdfUrl;
    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }

  /**
   * Создает действия для PDF viewer
   */
  protected createViewerActions(
    pdfUrl: string,
    options: PdfViewerOptions,
  ): { text: string; click: () => void }[] {
    const actions: { text: string; click: () => void }[] = [];

    // Действие скачивания
    if (options.autoDownload !== false) {
      actions.push({
        text: options.downloadLabel || 'Скачать PDF',
        click: () => this.downloadPdf(pdfUrl, this.getDefaultFilename()),
      });
    }

    // Действие печати
    if (options.printSupport !== false && this.isPrintSupported()) {
      actions.push({
        text: 'Печать',
        click: () => this.printPdf(pdfUrl),
      });
    }

    return actions;
  }

  /**
   * Проверка поддержки печати
   */
  protected isPrintSupported(): boolean {
    return !this.isMobile && typeof window !== 'undefined' && typeof window.open === 'function';
  }

  /**
   * URL для мобильного просмотра
   */
  protected getMobileViewerUrl(pdfUrl: string): string {
    // Для blob URLs Google Viewer не сработает, возвращаем оригинал
    if (pdfUrl.startsWith('blob:')) {
      return pdfUrl;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  }

  /**
   * Очистка конкретного Blob URL
   */
  protected cleanupBlobUrl(url: string): void {
    if (this.activeBlobUrls.has(url)) {
      this.revokeBlobUrl(url);
      this.activeBlobUrls.delete(url);
      console.log('Blob URL cleaned up:', url.substring(0, 50) + '...');
    }
  }

  /**
   * Имя файла по умолчанию
   */
  protected getDefaultFilename(): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `document_${timestamp}.pdf`;
  }
}
