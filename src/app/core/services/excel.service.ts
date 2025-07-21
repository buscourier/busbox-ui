import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';

export interface ExportOptions {
  title?: string;
  subtitle?: string;
  metadata?: Record<string, string | number>;
  showSummary?: boolean;
  footerText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  exportToExcel<T>(
    data: T[],
    filename: string,
    sheetName = 'Sheet1',
    columns?: { key: keyof T; header: string; width?: number }[],
    options?: ExportOptions,
  ): void {
    try {
      const worksheet = this.createWorksheetSimple(data, columns, options);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      const fileName = `${filename}_${this.getDateStamp()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Ошибка при экспорте в Excel');
    }
  }

  private createWorksheetSimple<T>(
    data: T[],
    columns?: { key: keyof T; header: string; width?: number }[],
    options?: ExportOptions,
  ): XLSX.WorkSheet {
    const worksheetData: unknown[][] = [];
    let currentRow = 0;

    // 1. Заголовок
    if (options?.title) {
      worksheetData.push([options.title]);
      worksheetData.push([]); // Пустая строка
      currentRow += 2;
    }

    // 2. Подзаголовок
    if (options?.subtitle) {
      worksheetData.push([options.subtitle]);
      worksheetData.push([]);
      currentRow += 2;
    }

    // 3. Метаинформация
    const metadataRowStart = currentRow;
    if (options?.metadata) {
      Object.entries(options.metadata).forEach(([key, value]) => {
        worksheetData.push([key, value]);
        currentRow++;
      });
      worksheetData.push([]);
      currentRow++;
    }

    // 4. Заголовки таблицы
    const tableHeaderRow = currentRow;
    if (columns) {
      const headers = columns.map((col) => col.header);
      worksheetData.push(headers);
      currentRow++;
    } else if (data.length > 0) {
      const firstItem = data[0];
      if (firstItem && typeof firstItem === 'object' && firstItem !== null) {
        const headers = Object.keys(firstItem as Record<string, unknown>);
        worksheetData.push(headers);
        currentRow++;
      }
    }

    // 5. Данные
    const dataStartRow = currentRow;
    data.forEach((item) => {
      if (columns) {
        const row = columns.map((col) => item[col.key]);
        worksheetData.push(row);
      } else {
        if (item && typeof item === 'object' && item !== null) {
          const row = Object.values(item as Record<string, unknown>);
          worksheetData.push(row);
        }
      }
      currentRow++;
    });

    // 6. Итоги
    const summaryRowStart = currentRow;
    if (options?.showSummary && data.length > 0) {
      worksheetData.push([]);
      worksheetData.push(['Итого записей:', data.length]);
      currentRow += 2;

      // Добавляем суммы по числовым колонкам
      if (columns) {
        const summaryRow: unknown[] = [];
        columns.forEach((col, index) => {
          if (this.isNumericColumn(data, col.key)) {
            const sum = data.reduce((total, item) => {
              const value = item[col.key];
              return total + (typeof value === 'number' ? value : 0);
            }, 0);
            summaryRow[index] = sum;
          } else {
            summaryRow[index] = index === 0 ? 'Итого:' : '';
          }
        });
        worksheetData.push(summaryRow);
        currentRow++;
      }
    }

    // 7. Футер
    const footerRow = currentRow;
    if (options?.footerText) {
      worksheetData.push([]);
      worksheetData.push([options.footerText]);
      currentRow += 2;
    }

    // 8. Создаем worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // ✅ 9. Применяем стили
    this.applyStyles(worksheet, {
      titleRow: options?.title ? 0 : -1,
      subtitleRow: options?.subtitle ? (options?.title ? 2 : 0) : -1,
      metadataStart: metadataRowStart,
      metadataEnd:
        metadataRowStart + (options?.metadata ? Object.keys(options.metadata).length - 1 : -1),
      tableHeaderRow,
      dataStartRow,
      dataEndRow: dataStartRow + data.length - 1,
      summaryStart: summaryRowStart,
      footerRow: options?.footerText ? footerRow + 1 : -1,
      columnCount: columns?.length || (data.length > 0 ? Object.keys(data[0] as object).length : 1),
    });

    // 10. Устанавливаем ширину колонок
    if (columns) {
      worksheet['!cols'] = columns.map((col) => ({ wch: col.width || 15 }));
    }

    return worksheet;
  }

  // ✅ Применение стилей
  private applyStyles(
    worksheet: XLSX.WorkSheet,
    ranges: {
      titleRow: number;
      subtitleRow: number;
      metadataStart: number;
      metadataEnd: number;
      tableHeaderRow: number;
      dataStartRow: number;
      dataEndRow: number;
      summaryStart: number;
      footerRow: number;
      columnCount: number;
    },
  ): void {
    // Стиль заголовка
    if (ranges.titleRow >= 0) {
      const titleCell = XLSX.utils.encode_cell({ r: ranges.titleRow, c: 0 });
      if (worksheet[titleCell]) {
        worksheet[titleCell].s = {
          font: {
            bold: true,
            sz: 16,
            color: { rgb: '000000' },
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
          },
          fill: {
            fgColor: { rgb: 'E6F3FF' },
          },
        };
      }

      // Объединяем ячейки заголовка
      worksheet['!merges'] = worksheet['!merges'] || [];
      worksheet['!merges'].push({
        s: { r: ranges.titleRow, c: 0 },
        e: { r: ranges.titleRow, c: ranges.columnCount - 1 },
      });
    }

    // Стиль подзаголовка
    if (ranges.subtitleRow >= 0) {
      const subtitleCell = XLSX.utils.encode_cell({ r: ranges.subtitleRow, c: 0 });
      if (worksheet[subtitleCell]) {
        worksheet[subtitleCell].s = {
          font: {
            bold: true,
            sz: 12,
            color: { rgb: '333333' },
          },
          alignment: {
            horizontal: 'center',
          },
        };
      }

      // Объединяем ячейки подзаголовка
      worksheet['!merges'] = worksheet['!merges'] || [];
      worksheet['!merges'].push({
        s: { r: ranges.subtitleRow, c: 0 },
        e: { r: ranges.subtitleRow, c: ranges.columnCount - 1 },
      });
    }

    // Стили метаданных
    if (ranges.metadataStart >= 0 && ranges.metadataEnd >= 0) {
      for (let row = ranges.metadataStart; row <= ranges.metadataEnd; row++) {
        // Ключ (левая колонка)
        const keyCell = XLSX.utils.encode_cell({ r: row, c: 0 });
        if (worksheet[keyCell]) {
          worksheet[keyCell].s = {
            font: { bold: true, sz: 10 },
            fill: { fgColor: { rgb: 'F0F0F0' } },
          };
        }

        // Значение (правая колонка)
        const valueCell = XLSX.utils.encode_cell({ r: row, c: 1 });
        if (worksheet[valueCell]) {
          worksheet[valueCell].s = {
            font: { sz: 10 },
          };
        }
      }
    }

    // Стили заголовков таблицы
    if (ranges.tableHeaderRow >= 0) {
      for (let col = 0; col < ranges.columnCount; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: ranges.tableHeaderRow, c: col });
        if (worksheet[headerCell]) {
          worksheet[headerCell].s = {
            font: {
              bold: true,
              sz: 11,
              color: { rgb: 'FFFFFF' },
            },
            fill: {
              fgColor: { rgb: '4472C4' },
            },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
            },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } },
            },
          };
        }
      }
    }

    // Стили данных (чередующиеся строки)
    if (ranges.dataStartRow >= 0 && ranges.dataEndRow >= 0) {
      for (let row = ranges.dataStartRow; row <= ranges.dataEndRow; row++) {
        const isEvenRow = (row - ranges.dataStartRow) % 2 === 0;

        for (let col = 0; col < ranges.columnCount; col++) {
          const dataCell = XLSX.utils.encode_cell({ r: row, c: col });
          if (worksheet[dataCell]) {
            worksheet[dataCell].s = {
              font: { sz: 10 },
              fill: {
                fgColor: { rgb: isEvenRow ? 'FFFFFF' : 'F8F9FA' },
              },
              border: {
                top: { style: 'thin', color: { rgb: 'E0E0E0' } },
                bottom: { style: 'thin', color: { rgb: 'E0E0E0' } },
                left: { style: 'thin', color: { rgb: 'E0E0E0' } },
                right: { style: 'thin', color: { rgb: 'E0E0E0' } },
              },
              alignment: {
                vertical: 'center',
              },
            };

            // Специальное форматирование для чисел
            if (typeof worksheet[dataCell].v === 'number') {
              worksheet[dataCell].s!.numFmt = '#,##0.00';
              worksheet[dataCell].s!.alignment!.horizontal = 'right';
            }
          }
        }
      }
    }

    // Стили итогов
    if (ranges.summaryStart >= 0) {
      // Строка "Итого записей"
      const summaryLabelCell = XLSX.utils.encode_cell({ r: ranges.summaryStart + 1, c: 0 });
      if (worksheet[summaryLabelCell]) {
        worksheet[summaryLabelCell].s = {
          font: { bold: true, sz: 11 },
          fill: { fgColor: { rgb: 'FFFFCC' } },
        };
      }

      const summaryValueCell = XLSX.utils.encode_cell({ r: ranges.summaryStart + 1, c: 1 });
      if (worksheet[summaryValueCell]) {
        worksheet[summaryValueCell].s = {
          font: { bold: true, sz: 11 },
          fill: { fgColor: { rgb: 'FFFFCC' } },
        };
      }

      // Строка с суммами
      if (ranges.summaryStart + 2 < Object.keys(worksheet).length) {
        for (let col = 0; col < ranges.columnCount; col++) {
          const sumCell = XLSX.utils.encode_cell({ r: ranges.summaryStart + 2, c: col });
          if (worksheet[sumCell]) {
            worksheet[sumCell].s = {
              font: { bold: true, sz: 10 },
              fill: { fgColor: { rgb: 'FFEB9C' } },
              border: {
                top: { style: 'thick', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
              },
            };

            if (typeof worksheet[sumCell].v === 'number') {
              worksheet[sumCell].s!.numFmt = '#,##0.00';
              worksheet[sumCell].s!.alignment = { horizontal: 'right' };
            }
          }
        }
      }
    }

    // Стиль футера
    if (ranges.footerRow >= 0) {
      const footerCell = XLSX.utils.encode_cell({ r: ranges.footerRow, c: 0 });
      if (worksheet[footerCell]) {
        worksheet[footerCell].s = {
          font: {
            italic: true,
            sz: 9,
            color: { rgb: '666666' },
          },
          alignment: {
            horizontal: 'center',
          },
        };
      }

      // Объединяем ячейки футера
      worksheet['!merges'] = worksheet['!merges'] || [];
      worksheet['!merges'].push({
        s: { r: ranges.footerRow, c: 0 },
        e: { r: ranges.footerRow, c: ranges.columnCount - 1 },
      });
    }
  }

  private isNumericColumn<T>(data: T[], key: keyof T): boolean {
    return data.some((item) => {
      const value = item[key];
      return typeof value === 'number' && !isNaN(value);
    });
  }

  private getDateStamp(): string {
    return new Date().toISOString().split('T')[0];
  }
}
