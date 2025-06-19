import { inject, Injectable } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { TUI_IS_MOBILE } from '@taiga-ui/cdk';
import { type TuiPdfViewerOptions, TuiPdfViewerService } from '@taiga-ui/kit';
import type { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { Observable } from 'rxjs';

export interface PdfViewerOptions extends Partial<TuiPdfViewerOptions> {
  autoDownload?: boolean;
  downloadLabel?: string;
  printSupport?: boolean;
  customActions?: PolymorpheusContent<TuiPdfViewerOptions>;
}

@Injectable({
  providedIn: 'root',
})
export class PdfViewerService {
  protected readonly sanitizer = inject(DomSanitizer);
  protected readonly pdfService = inject(TuiPdfViewerService);
  protected readonly isMobile = inject(TUI_IS_MOBILE);

  private activeBlobUrls = new Set<string>();

  showPdf(pdfUrl: string, label: string, options: PdfViewerOptions = {}): Observable<void> {
    return new Observable<void>((subscriber) => {
      const viewerConfig: TuiPdfViewerOptions = {
        data: undefined,
        label,
        actions: options.customActions || this.createDefaultActions(pdfUrl, options),
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

  getOriginalUrl(safeUrl: SafeResourceUrl): string {
    return (
      (safeUrl as { changingThisBreaksApplicationSecurity: string })
        .changingThisBreaksApplicationSecurity || ''
    );
  }

  downloadPdf(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = this.getOriginalUrl(url);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadPdfFromBlob(blob: Blob, filename: string): void {
    const url = this.createBlobUrl(blob);
    this.downloadPdf(url, filename);

    // Очищаем URL через небольшую задержку
    setTimeout(() => this.revokeBlobUrl(url), 1000);
  }

  printPdf(url: string): void {
    const pdfWindow = window.open(this.getOriginalUrl(url), '_blank');

    if (pdfWindow) {
      setTimeout(() => {
        pdfWindow.print();
      }, 1500);
    } else {
      console.warn('Не удалось открыть окно. Возможно заблокированы popup.');
    }
  }

  createBlobUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  revokeBlobUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * Cleans up all active blob URLs to prevent memory leaks
   */
  cleanup(): void {
    console.log(`Cleaning up ${this.activeBlobUrls.size} blob URLs`);
    this.activeBlobUrls.forEach((url) => this.revokeBlobUrl(url));
    this.activeBlobUrls.clear();
  }

  /**
   * Creates safe URL for viewing
   */
  protected createSafeUrl(pdfUrl: string) {
    const finalUrl = this.isMobile ? this.getMobileViewerUrl(pdfUrl) : pdfUrl;
    return this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }

  protected createDefaultActions(pdfUrl: string, options: PdfViewerOptions): string {
    const actions: string[] = [];

    if (options.autoDownload !== false) {
      actions.push(options.downloadLabel || 'Скачать PDF');
    }

    if (options.printSupport !== false && this.isPrintSupported()) {
      actions.push('Печать');
    }

    return actions.join(', ');
  }

  protected isPrintSupported(): boolean {
    return !this.isMobile && typeof window !== 'undefined' && typeof window.open === 'function';
  }

  protected getMobileViewerUrl(pdfUrl: string): string {
    // Google Viewer won't work for blob URLs, return original
    if (pdfUrl.startsWith('blob:')) {
      return pdfUrl;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  }

  protected cleanupBlobUrl(url: string): void {
    if (this.activeBlobUrls.has(url)) {
      this.revokeBlobUrl(url);
      this.activeBlobUrls.delete(url);
      console.log('Blob URL cleaned up:', url.substring(0, 50) + '...');
    }
  }

  protected getDefaultFilename(): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `document_${timestamp}.pdf`;
  }
}
