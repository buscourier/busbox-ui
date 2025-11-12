import { Injectable } from '@angular/core';

export interface DomProcessor {
  prepareElementForPrint(element: HTMLElement): HTMLElement;

  cleanupInteractiveElements(element: HTMLElement): void;

  replaceInputsWithValues(element: HTMLElement): void;

  waitForImagesLoad(element: HTMLElement, timeout?: number): Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class DefaultDomProcessor implements DomProcessor {
  prepareElementForPrint(element: HTMLElement): HTMLElement {
    const copy = element.cloneNode(true) as HTMLElement;
    this.cleanupInteractiveElements(copy);
    this.replaceInputsWithValues(copy);
    this.handlePrintVisibility(copy);
    this.ensureTablesVisible(copy);
    return copy;
  }

  private ensureTablesVisible(element: HTMLElement): void {
    // Make sure the tables are visible and have the correct sizes
    const tables = element.querySelectorAll('table');
    tables.forEach((table) => {
      const htmlTable = table as HTMLElement;
      // Force the table to be displayed
      htmlTable.style.display = 'table';
      htmlTable.style.visibility = 'visible';
      htmlTable.style.opacity = '1';
      htmlTable.style.maxWidth = '100%';

      // Make sure all cells are visible
      const cells = table.querySelectorAll('td, th');
      cells.forEach((cell) => {
        const htmlCell = cell as HTMLElement;
        htmlCell.style.visibility = 'visible';
        htmlCell.style.opacity = '1';
      });
    });
  }

  private handlePrintVisibility(element: HTMLElement): void {
    const hiddenElements = element.querySelectorAll('.no-print');
    hiddenElements.forEach((el) => el.remove());

    const printOnlyElements = element.querySelectorAll('.print-only');
    printOnlyElements.forEach((el) => {
      (el as HTMLElement).style.display = 'block';
    });

    const tHeadPrintOnlyElements = element.querySelectorAll('.t-head-print-only');
    tHeadPrintOnlyElements.forEach((el) => {
      (el as HTMLElement).style.display = 'table-header-group';
    });

    const tFootPrintOnlyElements = element.querySelectorAll('.t-foot-print-only');
    tFootPrintOnlyElements.forEach((el) => {
      (el as HTMLElement).style.display = 'table-footer-group';
    });
  }

  cleanupInteractiveElements(element: HTMLElement): void {
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
        console.warn(`Failed to remove elements by selector: ${selector}`, error);
      }
    });

    this.removeButtonContainers(element);
  }

  replaceInputsWithValues(element: HTMLElement): void {
    const inputs = element.querySelectorAll('input[type="text"], input[type="checkbox"]');
    inputs.forEach((input) => {
      const inputEl = input as HTMLInputElement;
      const span = document.createElement('span');

      if (inputEl.type === 'checkbox') {
        const checkboxContainer = document.createElement('span');

        Object.assign(checkboxContainer.style, {
          display: 'inline-block',
          width: '14px',
          height: '14px',
          border: '2px solid #000',
          borderRadius: '2px',
          textAlign: 'center',
          lineHeight: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: '#fff',
          verticalAlign: 'middle',
        });

        if (inputEl.checked) {
          checkboxContainer.textContent = '✓';
        }

        inputEl.parentNode?.replaceChild(checkboxContainer, inputEl);
      } else {
        span.textContent = inputEl.value || '';
        inputEl.parentNode?.replaceChild(span, inputEl);
      }
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

  async waitForImagesLoad(element: HTMLElement, timeout = 5000): Promise<void> {
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map((img) => {
      return new Promise<void>((resolve) => {
        const imgElement = img as HTMLImageElement;
        if (imgElement.complete && imgElement.naturalWidth > 0) {
          resolve();
        } else {
          imgElement.onload = () => resolve();
          imgElement.onerror = () => {
            console.warn('Image failed to load:', imgElement.src);
            resolve();
          };

          setTimeout(() => {
            console.warn('Image load timeout:', imgElement.src);
            resolve();
          }, timeout);
        }
      });
    });

    await Promise.all(imagePromises);
    // console.log(`Loaded ${images.length} images`);
  }
}
