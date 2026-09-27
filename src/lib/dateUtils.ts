import { format } from "date-fns";

/**
 * Authoritative timezone for the church and congregation (The Apostolic Church North West / Chicago).
 */
export const CHURCH_TIMEZONE = 'America/Chicago';

/**
 * Returns today's date (or the given date) formatted as YYYY-MM-DD in America/Chicago timezone.
 * Guarantees that whether an admin or visitor is in UTC, California, or London,
 * church dates are always anchored strictly to Chicago time.
 */
export function getChicagoDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: CHURCH_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

// Keep getLocalDateString as alias so existing callers work seamlessly
export const getLocalDateString = getChicagoDateString;

/**
 * Returns a Date object representing the current moment in America/Chicago timezone.
 */
export function getChicagoDate(date: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CHURCH_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(date);

  const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
  return new Date(
    getPart('year'),
    getPart('month') - 1,
    getPart('day'),
    getPart('hour'),
    getPart('minute'),
    getPart('second')
  );
}

/**
 * Returns the current month name (e.g. "September") in Chicago timezone.
 */
export function getChicagoMonthName(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: CHURCH_TIMEZONE,
    month: 'long',
  }).format(date);
}

/**
 * Parses a YYYY-MM-DD date string into a Date object at midnight in local calendar time.
 * Standard `new Date("YYYY-MM-DD")` is parsed as UTC midnight by ECMAScript,
 * which results in the previous day in Western timezones (e.g. US Central/Eastern).
 */
export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return getChicagoDate();
  const clean = dateStr.split('T')[0];
  const parts = clean.split('-').map(Number);
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date(dateStr);
}

/**
 * Formats a YYYY-MM-DD date string using date-fns format pattern without shifting days.
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
