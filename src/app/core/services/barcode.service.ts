import { Injectable } from '@angular/core';
import JsBarcode from 'jsbarcode';

export interface BarcodeOptions {
  width?: number;
  height?: number;
  fontSize?: number;
  displayValue?: boolean;
  lineColor?: string;
  background?: string;
  margin?: number;
  format?: 'CODE128' | 'EAN13' | 'EAN8';
  textAlign?: 'left' | 'center' | 'right';
  textPosition?: 'bottom' | 'top';
  textMargin?: number;
  fontOptions?: string;
  valid?: (value: string) => boolean;
}

export interface BarcodeTheme {
  name: string;
  width: number;
  height: number;
  fontSize: number;
  lineColor: string;
  background: string;
  displayValue: boolean;
  margin: number;
  format: BarcodeOptions['format'];
  textAlign?: BarcodeOptions['textAlign'];
  textPosition?: BarcodeOptions['textPosition'];
}

export type BarcodeThemeKey = 'default' | 'invoice';

export interface BarcodeValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  private readonly defaultOptions: Required<Omit<BarcodeOptions, 'valid'>> = {
    width: 2,
    height: 100,
    fontSize: 20,
    displayValue: true,
    lineColor: '#000000',
    background: '#FFFFFF',
    margin: 10,
    format: 'CODE128',
    textAlign: 'center',
    textPosition: 'bottom',
    textMargin: 2,
    fontOptions: '',
  };

  private readonly themes: Record<BarcodeThemeKey, BarcodeTheme> = {
    default: {
      name: 'Стандартный',
      width: 2,
      height: 100,
      fontSize: 20,
      lineColor: '#000000',
      background: '#FFFFFF',
      displayValue: true,
      margin: 10,
      format: 'CODE128',
      textAlign: 'center',
      textPosition: 'bottom',
    },
    invoice: {
      name: 'Накладная',
      width: 1.5,
      height: 60,
      fontSize: 14,
      lineColor: '#1a1a1a',
      background: '#FFFFFF',
      displayValue: false,
      margin: 5,
      format: 'CODE128',
      textAlign: 'center',
      textPosition: 'bottom',
    },
  };

  validateBarcodeValue(
    value: string | number,
    format: BarcodeOptions['format'] = 'CODE128',
  ): BarcodeValidationResult {
    const stringValue = String(value).trim();

    if (!stringValue) {
      return {
        isValid: false,
        error: 'Значение не может быть пустым',
        suggestions: ['Введите корректное значение'],
      };
    }

    switch (format) {
      case 'CODE128':
        return this.validateCODE128(stringValue);
      case 'EAN13':
        return this.validateEAN13(stringValue);
      case 'EAN8':
        return this.validateEAN8(stringValue);
      default:
        return { isValid: true };
    }
  }

  async generateBarcode(
    value: string | number,
    options: Partial<BarcodeOptions> = {},
  ): Promise<string> {
    const config = { ...this.defaultOptions, ...options };
    const data = String(value).trim();

    const validation = this.validateBarcodeValue(data, config.format);
    if (!validation.isValid) {
      throw new Error(`Невалидное значение штрих-кода: ${validation.error}`);
    }

    try {
      const canvas = document.createElement('canvas');

      JsBarcode(canvas, data, {
        format: config.format,
        width: config.width,
        height: config.height,
        fontSize: config.fontSize,
        lineColor: config.lineColor,
        background: config.background,
        displayValue: config.displayValue,
        margin: config.margin,
        textAlign: config.textAlign,
        textPosition: config.textPosition,
        textMargin: config.textMargin,
        fontOptions: config.fontOptions,
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Ошибка при генерации штрих-кода:', error);
      throw new Error(`Не удалось создать штрих-код для значения: ${value}. ${error}`);
    }
  }

  async generateBarcodeCanvas(
    value: string | number,
    options: Partial<BarcodeOptions> = {},
  ): Promise<HTMLCanvasElement> {
    const config = { ...this.defaultOptions, ...options };
    const data = String(value).trim();

    const validation = this.validateBarcodeValue(data, config.format);
    if (!validation.isValid) {
      throw new Error(`Невалидное значение штрих-кода: ${validation.error}`);
    }

    try {
      const canvas = document.createElement('canvas');

      JsBarcode(canvas, data, {
        format: config.format,
        width: config.width,
        height: config.height,
        fontSize: config.fontSize,
        lineColor: config.lineColor,
        background: config.background,
        displayValue: config.displayValue,
        margin: config.margin,
        textAlign: config.textAlign,
        textPosition: config.textPosition,
        textMargin: config.textMargin,
        fontOptions: config.fontOptions,
      });

      return canvas;
    } catch (error) {
      console.error('Ошибка при генерации Canvas штрих-кода:', error);
      throw new Error(`Не удалось создать Canvas штрих-код для значения: ${value}`);
    }
  }

  async generateBarcodeSvg(
    value: string | number,
    options: Partial<BarcodeOptions> = {},
  ): Promise<string> {
    const config = { ...this.defaultOptions, ...options };
    const data = String(value).trim();

    const validation = this.validateBarcodeValue(data, config.format);
    if (!validation.isValid) {
      throw new Error(`Невалидное значение штрих-кода: ${validation.error}`);
    }

    try {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      JsBarcode(svg, data, {
        format: config.format,
        width: config.width,
        height: config.height,
        fontSize: config.fontSize,
        lineColor: config.lineColor,
        background: config.background,
        displayValue: config.displayValue,
        margin: config.margin,
        textAlign: config.textAlign,
        textPosition: config.textPosition,
        textMargin: config.textMargin,
        fontOptions: config.fontOptions,
      });

      return svg.outerHTML;
    } catch (error) {
      console.error('Ошибка при генерации SVG штрих-кода:', error);
      throw new Error(`Не удалось создать SVG штрих-код для значения: ${value}`);
    }
  }

  async generateBarcodeWithTheme(
    value: string | number,
    theme: BarcodeThemeKey = 'default',
    customOptions: Partial<BarcodeOptions> = {},
  ): Promise<string> {
    const themeConfig = this.getTheme(theme);
    const options: Partial<BarcodeOptions> = {
      ...themeConfig,
      ...customOptions,
    };

    return this.generateBarcode(value, options);
  }

  async insertBarcodeIntoElement(
    targetElement: HTMLElement,
    value: string | number,
    options: Partial<BarcodeOptions> = {},
  ): Promise<void> {
    try {
      const config = { ...this.defaultOptions, ...options };
      const data = String(value).trim();

      const validation = this.validateBarcodeValue(data, config.format);
      if (!validation.isValid) {
        throw new Error(`Невалидное значение штрих-кода: ${validation.error}`);
      }

      targetElement.innerHTML = '';

      JsBarcode(targetElement, data, {
        format: config.format,
        width: config.width,
        height: config.height,
        fontSize: config.fontSize,
        lineColor: config.lineColor,
        background: config.background,
        displayValue: config.displayValue,
        margin: config.margin,
        textAlign: config.textAlign,
        textPosition: config.textPosition,
        textMargin: config.textMargin,
        fontOptions: config.fontOptions,
      });

      this.applyResponsiveStyles(targetElement);
    } catch (error) {
      console.error('Ошибка при вставке штрих-кода:', error);
      this.insertFallback(targetElement, value, options);
    }
  }

  async insertBarcodeWithTheme(
    targetElement: HTMLElement,
    value: string | number,
    theme: BarcodeThemeKey = 'default',
    customOptions: Partial<BarcodeOptions> = {},
  ): Promise<void> {
    const themeConfig = this.getTheme(theme);
    const options: Partial<BarcodeOptions> = {
      ...themeConfig,
      ...customOptions,
    };

    return this.insertBarcodeIntoElement(targetElement, value, options);
  }

  async processBarcodesInElement(
    element: HTMLElement,
    value: string | number,
    options: Partial<BarcodeOptions> = {},
  ): Promise<void> {
    const barcodePlaceholders = element.querySelectorAll('[data-barcode-placeholder]');

    const promises = Array.from(barcodePlaceholders).map(async (placeholder) => {
      try {
        const elementOptions = this.extractOptionsFromElement(placeholder as HTMLElement);
        const finalOptions = { ...options, ...elementOptions };

        const barcodeDataUrl = await this.generateBarcode(value, finalOptions);

        const img = document.createElement('img');
        img.src = barcodeDataUrl;
        img.alt = `Barcode for ${value}`;

        this.applyResponsiveStyles(img);

        placeholder.parentNode?.replaceChild(img, placeholder);
      } catch (error) {
        console.error('Ошибка при обработке штрих-код плейсхолдера:', error);
        this.insertFallback(placeholder as HTMLElement, value, options);
      }
    });

    await Promise.all(promises);
  }

  getTheme(themeKey: BarcodeThemeKey): BarcodeTheme {
    const theme = this.themes[themeKey];
    if (!theme) {
      console.warn(`Тема "${themeKey}" не найдена, используется тема по умолчанию`);
      return this.themes.default;
    }
    return theme;
  }

  getAvailableThemes(): { key: BarcodeThemeKey; theme: BarcodeTheme }[] {
    return Object.entries(this.themes).map(([key, theme]) => ({
      key: key as BarcodeThemeKey,
      theme,
    }));
  }

  isFormatSupported(format: string): boolean {
    const supportedFormats = ['CODE128', 'EAN13', 'EAN8'];
    return supportedFormats.includes(format);
  }

  private validateCODE128(value: string): BarcodeValidationResult {
    // Check that all characters are within ASCII 0-127 range
    for (let i = 0; i < value.length; i++) {
      const charCode = value.charCodeAt(i);
      if (charCode > 127) {
        return {
          isValid: false,
          error: 'CODE128 может содержать только ASCII символы (0-127)',
          suggestions: [
            'Удалите символы вне ASCII диапазона',
            'Используйте только латинские буквы, цифры и стандартные символы',
            `Проблемный символ: "${value[i]}" (код ${charCode})`,
          ],
        };
      }
    }

    // Check for empty value
    if (value.length === 0) {
      return {
        isValid: false,
        error: 'Значение не может быть пустым',
        suggestions: ['Введите корректное значение для штрих-кода'],
      };
    }

    // Practical length limitation for barcode readability
    if (value.length > 80) {
      return {
        isValid: false,
        error: 'Значение слишком длинное для практического использования',
        suggestions: [
          'Сократите значение до 80 символов или менее',
          'Разбейте данные на несколько штрих-кодов',
        ],
      };
    }

    return { isValid: true };
  }

  private validateEAN13(value: string): BarcodeValidationResult {
    const isValid = /^\d{13}$/.test(value);

    if (!isValid) {
      return {
        isValid: false,
        error: 'EAN13 должен содержать ровно 13 цифр',
        suggestions: ['Введите 13 цифр', 'Проверьте правильность кода'],
      };
    }

    return { isValid: true };
  }

  private validateEAN8(value: string): BarcodeValidationResult {
    const isValid = /^\d{8}$/.test(value);

    if (!isValid) {
      return {
        isValid: false,
        error: 'EAN8 должен содержать ровно 8 цифр',
        suggestions: ['Введите 8 цифр', 'Проверьте правильность кода'],
      };
    }

    return { isValid: true };
  }

  private extractOptionsFromElement(element: HTMLElement): Partial<BarcodeOptions> {
    const options: Partial<BarcodeOptions> = {};

    const width = element.dataset['barcodeWidth'];
    if (width) options.width = parseInt(width, 10);

    const height = element.dataset['barcodeHeight'];
    if (height) options.height = parseInt(height, 10);

    const theme = element.dataset['barcodeTheme'] as BarcodeThemeKey;
    if (theme && this.themes[theme]) {
      Object.assign(options, this.themes[theme]);
    }

    const format = element.dataset['barcodeFormat'] as BarcodeOptions['format'];
    if (format && this.isFormatSupported(format)) {
      options.format = format;
    }

    const displayValue = element.dataset['barcodeDisplayValue'];
    if (displayValue !== undefined) {
      options.displayValue = displayValue === 'true';
    }

    return options;
  }

  private applyResponsiveStyles(element: HTMLElement): void {
    Object.assign(element.style, {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      margin: '0 auto',
    });
  }

  private insertFallback(
    element: HTMLElement,
    value: string | number,
    options: Partial<BarcodeOptions> = {},
  ): void {
    const height = options.height || this.defaultOptions.height;
    const width = Math.max(200, (options.width || this.defaultOptions.width) * 50);

    element.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid #ccc;
        background: #f9f9f9;
        font-size: 12px;
        text-align: center;
        color: #666;
        width: ${width}px;
        height: ${height + 40}px;
        font-family: monospace;
        padding: 5px;
        box-sizing: border-box;
      ">
        <div style="margin-bottom: 5px;">⚠️ Штрих-код недоступен</div>
        <div style="font-size: 10px; margin-top: 5px; word-break: break-all;">${value}</div>
      </div>
    `;
  }
}
