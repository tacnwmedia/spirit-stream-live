import { format } from "date-fns";

/**
 * Returns today's date (or the given date) as a YYYY-MM-DD string in the user's local timezone.
 * Avoids the UTC-shift bug caused by new Date().toISOString().split('T')[0].
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD date string into a Date object at midnight in LOCAL timezone.
 * Standard `new Date("YYYY-MM-DD")` is parsed as UTC midnight by ECMAScript,
 * which results in the previous day in Western timezones (e.g. US Central/Eastern).
 */
export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const clean = dateStr.split('T')[0];
  const parts = clean.split('-').map(Number);
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date(dateStr);
}

/**
 * Formats a YYYY-MM-DD date string using date-fns in local timezone without shifting days.
 */
export function formatDateString(dateStr: string, formatPattern: string): string {
  if (!dateStr) return '';
  return format(parseLocalDate(dateStr), formatPattern);
}

/**
 * Formats a time string (e.g., "13:00", "13:00:00", "09:30") into human-friendly 12-hour AM/PM format (e.g. "1:00 PM").
 */
export function formatEventTime(timeStr?: string | null): string {
  if (!timeStr) return '';
  // If already contains AM/PM, return trimmed
  if (/(am|pm)/i.test(timeStr)) return timeStr.trim();

  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return timeStr;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  return `${hours}:${minutes} ${ampm}`;
}
