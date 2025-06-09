import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  exportToExcel<T>(
    data: T[],
    filename: string,
    sheetName = 'Sheet1',
    columns?: { key: keyof T; header: string; width?: number }[],
  ): void {
    try {
      // Создаем worksheet
      const worksheet = this.createWorksheet(data, columns);

      // Создаем workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Экспортируем файл
      const fileName = `${filename}_${this.getDateStamp()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Ошибка при экспорте в Excel');
    }
  }

  private createWorksheet<T>(
    data: T[],
    columns?: { key: keyof T; header: string; width?: number }[],
  ): XLSX.WorkSheet {
    if (!columns) {
      // Автоматическое создание из данных
      return XLSX.utils.json_to_sheet(data);
    }

    // Создание с кастомными колонками
    const headers = columns.map((col) => col.header);
    const mappedData = data.map((item) =>
      columns.reduce(
        (acc, col) => {
          acc[col.header] = item[col.key];
          return acc;
        },
        {} as Record<string, unknown>,
      ),
    );

    const worksheet = XLSX.utils.json_to_sheet(mappedData, { header: headers });

    // Устанавливаем ширину колонок
    const columnWidths = columns.map((col) => ({ wch: col.width || 15 }));
    worksheet['!cols'] = columnWidths;

    return worksheet;
  }

  private getDateStamp(): string {
    return new Date().toISOString().split('T')[0];
  }
}
