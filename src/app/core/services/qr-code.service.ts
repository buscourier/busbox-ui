import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

export interface QrCodeOptions {
  baseUrl?: string;
  size?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  /** Уровень коррекции ошибок */
  errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high';
  /** Отступы вокруг QR-кода */
  margin?: number;
}

export interface QrCodeTheme {
  name: string;
  color: {
    dark: string;
    light: string;
  };
  size: number;
  errorCorrectionLevel: QrCodeOptions['errorCorrectionLevel'];
}

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  private readonly defaultOptions: Required<QrCodeOptions> = {
    baseUrl: 'https://баскурьер.рф/find-order?id=',
    size: 128,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'medium',
    margin: 1,
  };

  private readonly themes: Record<string, QrCodeTheme> = {
    default: {
      name: 'Стандартная',
      color: { dark: '#000000', light: '#FFFFFF' },
      size: 128,
      errorCorrectionLevel: 'medium',
    },
    invoice: {
      name: 'Накладная',
      color: { dark: '#1a1a1a', light: '#FFFFFF' },
      size: 100,
      errorCorrectionLevel: 'high',
    },
    small: {
      name: 'Маленький',
      color: { dark: '#333333', light: '#FFFFFF' },
      size: 64,
      errorCorrectionLevel: 'medium',
    },
    large: {
      name: 'Большой',
      color: { dark: '#000000', light: '#FFFFFF' },
      size: 256,
      errorCorrectionLevel: 'high',
    },
  };

  /**
   * Генерирует QR-код как Data URL
   */
  async generateQrCode(id: string | number, options: Partial<QrCodeOptions> = {}): Promise<string> {
    const config = { ...this.defaultOptions, ...options };
    const url = this.buildTrackingUrl(id, config.baseUrl);

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: config.size,
        color: config.color,
        errorCorrectionLevel: config.errorCorrectionLevel,
        margin: config.margin,
        type: 'image/png',
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Ошибка при генерации QR-кода:', error);
      throw new Error(`Не удалось создать QR-код для ID: ${id}`);
    }
  }

  /**
   * Генерирует QR-код как Canvas элемент
   */
  async generateQrCodeCanvas(
    id: string | number,
    options: Partial<QrCodeOptions> = {},
  ): Promise<HTMLCanvasElement> {
    const config = { ...this.defaultOptions, ...options };
    const url = this.buildTrackingUrl(id, config.baseUrl);

    try {
      const canvas = document.createElement('canvas');

      await QRCode.toCanvas(canvas, url, {
        width: config.size,
        color: config.color,
        errorCorrectionLevel: config.errorCorrectionLevel,
        margin: config.margin,
      });

      return canvas;
    } catch (error) {
      console.error('Ошибка при генерации QR-кода на canvas:', error);
      throw new Error(`Не удалось создать QR-код для ID: ${id}`);
    }
  }

  /**
   * Генерирует QR-код с использованием темы
   */
  async generateQrCodeWithTheme(
    id: string | number,
    themeName: keyof typeof this.themes = 'default',
    customOptions: Partial<QrCodeOptions> = {},
  ): Promise<string> {
    const theme = this.themes[themeName];
    if (!theme) {
      throw new Error(`Тема "${themeName}" не найдена`);
    }

    const options: Partial<QrCodeOptions> = {
      ...theme,
      ...customOptions,
    };

    return this.generateQrCode(id, options);
  }

  /**
   * Создает QR-код и вставляет его в указанный контейнер
   */
  async insertQrCodeIntoElement(
    targetElement: HTMLElement,
    id: string | number,
    options: Partial<QrCodeOptions> = {},
  ): Promise<void> {
    try {
      const qrCanvas = await this.generateQrCodeCanvas(id, options);

      // Очищаем контейнер и вставляем QR-код
      targetElement.innerHTML = '';
      targetElement.appendChild(qrCanvas);

      // Применяем стили для правильного отображения
      Object.assign(qrCanvas.style, {
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
      });
    } catch (error) {
      console.error('Ошибка при вставке QR-кода:', error);
      this.insertQrCodeFallback(targetElement, options);
    }
  }

  /**
   * Заменяет все QR-код плейсхолдеры в элементе на реальные QR-коды
   */
  async processQrCodesInElement(
    element: HTMLElement,
    id: string | number,
    options: Partial<QrCodeOptions> = {},
  ): Promise<void> {
    // Ищем все элементы с data-qr-placeholder
    const qrPlaceholders = element.querySelectorAll('[data-qr-placeholder]');

    const promises = Array.from(qrPlaceholders).map(async (placeholder) => {
      try {
        // Получаем опции из data-атрибутов
        const elementOptions = this.extractOptionsFromElement(placeholder as HTMLElement);
        const finalOptions = { ...options, ...elementOptions };

        const qrDataUrl = await this.generateQrCode(id, finalOptions);

        // Создаем img элемент с QR-кодом
        const img = document.createElement('img');
        img.src = qrDataUrl;
        img.alt = `QR Code for order ${id}`;

        // Применяем стили
        Object.assign(img.style, {
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
        });

        // Заменяем плейсхолдер на изображение
        placeholder.parentNode?.replaceChild(img, placeholder);
      } catch (error) {
        console.error('Ошибка при обработке QR-код плейсхолдера:', error);
        this.insertQrCodeFallback(placeholder as HTMLElement, options);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Генерирует URL для отслеживания заказа
   */
  buildTrackingUrl(id: string | number, baseUrl?: string): string {
    const url = baseUrl || this.defaultOptions.baseUrl;
    return `${url}${id}`;
  }

  /**
   * Извлекает опции из data-атрибутов элемента
   */
  private extractOptionsFromElement(element: HTMLElement): Partial<QrCodeOptions> {
    const options: Partial<QrCodeOptions> = {};

    const size = element.dataset['qrSize'];
    if (size) {
      options.size = parseInt(size, 10);
    }

    const theme = element.dataset['qrTheme'];
    if (theme && this.themes[theme]) {
      const themeConfig = this.themes[theme];
      options.size = themeConfig.size;
      options.color = themeConfig.color;
      options.errorCorrectionLevel = themeConfig.errorCorrectionLevel;
    }

    const baseUrl = element.dataset['qrBaseUrl'];
    if (baseUrl) {
      options.baseUrl = baseUrl;
    }

    return options;
  }

  /**
   * Fallback при ошибке генерации QR-кода
   */
  private insertQrCodeFallback(element: HTMLElement, options: Partial<QrCodeOptions> = {}): void {
    const size = options.size || this.defaultOptions.size;

    element.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ccc;
        background: #f9f9f9;
        font-size: 10px;
        text-align: center;
        color: #666;
        width: ${size}px;
        height: ${size}px;
        font-family: Arial, sans-serif;
      ">
        QR-код<br>недоступен
      </div>
    `;
  }
}
