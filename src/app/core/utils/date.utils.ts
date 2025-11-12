/**
 * Formats a Date object to YYYY-MM-DD string without timezone offset.
 * This ensures the date is formatted in local time, not UTC.
 *
 * @param date - Native Date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 *
 * @example
 * ```typescript
 * const date = new Date('2025-11-12');
 * formatDateToString(date); // "2025-11-12" (local time, not UTC)
 * ```
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
