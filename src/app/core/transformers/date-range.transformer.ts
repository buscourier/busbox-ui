import { Injectable } from '@angular/core';
import type { TuiValueTransformer } from '@taiga-ui/cdk';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';

import { formatDateToString } from '../utils';

@Injectable()
export class CustomDateRangeTransformer
  implements TuiValueTransformer<TuiDayRange | null, string | null>
{
  /**
   * Converts date range string to TuiDayRange instance.
   * @param controlValue - Date range string in format "YYYY-MM-DD,YYYY-MM-DD" or null
   */
  fromControlValue(controlValue: string | null): TuiDayRange | null {
    if (!controlValue) {
      return null;
    }

    try {
      // Parse string "2025-01-01,2025-01-31"
      const [fromStr, toStr] = controlValue.split(',');

      if (!fromStr || !toStr) {
        return null;
      }

      const fromDate = new Date(fromStr.trim());
      const toDate = new Date(toStr.trim());

      // Validate dates
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return null;
      }

      const fromDay = TuiDay.fromLocalNativeDate(fromDate);
      const toDay = TuiDay.fromLocalNativeDate(toDate);

      return new TuiDayRange(fromDay, toDay);
    } catch (error) {
      console.warn('Error parsing date range:', controlValue, error);
      return null;
    }
  }

  /**
   * Converts TuiDayRange to date range string.
   * @param dayRange - TuiDayRange instance or null
   */
  toControlValue(dayRange: TuiDayRange | null): string | null {
    if (!dayRange || !dayRange.from || !dayRange.to) {
      return null;
    }

    try {
      const fromDate = dayRange.from.toLocalNativeDate();
      const toDate = dayRange.to.toLocalNativeDate();

      // Форматируем в строку "YYYY-MM-DD,YYYY-MM-DD" без timezone сдвига
      const fromStr = formatDateToString(fromDate);
      const toStr = formatDateToString(toDate);

      return `${fromStr},${toStr}`;
    } catch (error) {
      console.warn('Error converting date range to string:', dayRange, error);
      return null;
    }
  }
}
