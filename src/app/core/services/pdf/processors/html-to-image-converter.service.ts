import { Injectable } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import type { Options } from 'html-to-image/lib/types';

import { type DocumentProcessingOptions, ImageFormat } from '@shared/types';

export interface ImageConverter {
  convertElementToImage(element: HTMLElement, options: DocumentProcessingOptions): Promise<string>;

  isFormatSupported(format: ImageFormat): boolean;
}

@Injectable({ providedIn: 'root' })
export class HtmlToImageConverter implements ImageConverter {
  async convertElementToImage(
    element: HTMLElement,
    options: DocumentProcessingOptions,
  ): Promise<string> {
    const htmlToImageOptions = this.buildConversionOptions(element, options);

    try {
      let dataUrl: string;

      switch (options.imageFormat || ImageFormat.PNG) {
        case ImageFormat.JPEG:
          dataUrl = await htmlToImage.toJpeg(element, htmlToImageOptions);
          break;
        case ImageFormat.WEBP:
          if (this.isFormatSupported(ImageFormat.WEBP)) {
            dataUrl = await htmlToImage.toPng(element, htmlToImageOptions);
          } else {
            dataUrl = await htmlToImage.toPng(element, htmlToImageOptions);
          }
          break;
        default:
          dataUrl = await htmlToImage.toPng(element, htmlToImageOptions);
      }

      return dataUrl;
    } catch (error) {
      console.error('Image conversion error:', error);
      return this.fallbackConversion(element, options);
    }
  }

  isFormatSupported(format: ImageFormat): boolean {
    if (format === ImageFormat.WEBP) {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const dataURL = canvas.toDataURL('image/webp');
      return dataURL.indexOf('data:image/webp') === 0;
    }
    return true;
  }

  private buildConversionOptions(
    element: HTMLElement,
    options: DocumentProcessingOptions,
  ): Options {
    const scale = options.scale || 2.5;

    return {
      width: element.scrollWidth * scale,
      height: element.scrollHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: element.scrollWidth + 'px',
        height: element.scrollHeight + 'px',
      },
      quality: options.quality || 0.95,
      pixelRatio: options.pixelRatio || window.devicePixelRatio || 1,
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: options.skipFonts ?? true,
      includeQueryParams: options.includeQueryParams ?? false,
      filter: (node: Node) => {
        if (node instanceof Element && node.classList) {
          return !node.classList.contains('no-print');
        }
        return true;
      },
      // onCloneDocument: (document: Document) => {
      //   const styles = document.createElement('style');
      //   styles.textContent = `
      //     * {
      //       -webkit-print-color-adjust: exact !important;
      //       color-adjust: exact !important;
      //       print-color-adjust: exact !important;
      //     }
      //   `;
      //
      //   console.log('styles styles', styles);
      //   document.head.appendChild(styles);
      // },
    };
  }

  private async fallbackConversion(
    element: HTMLElement,
    options: DocumentProcessingOptions,
  ): Promise<string> {
    return await htmlToImage.toPng(element, {
      quality: options.quality || 0.95,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });
  }
}
