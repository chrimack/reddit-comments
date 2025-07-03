import { config } from '@/config';

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: config.app.timeZone,
};

/**
 * Gets the current local hour in 24-hour format (0 - 23)
 */
function getLocalHour() {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    hour12: false,
    timeZone: config.app.timeZone,
  };

  return Number(formatDate(new Date(), options));
}

/**
 * Returns the current local date and time as an ISO-like string (YYYY-MM-DDTHH:mm:ss),
 * using the configured timezone. Uses 'sv-SE' locale to produce consistent, sortable format.
 * Example: '2025-07-03T14:05:12'
 */
function getLocalTimestamp(): string {
  return new Date()
    .toLocaleString('sv-SE', {
      timeZone: config.app.timeZone,
      hour12: false,
    })
    .replace(' ', 'T');
}

/**
 * Gets today's date in the format `YYYY-MM-DD`
 */
function getTodayDateString() {
  return formatDate();
}

/**
 * Formats a Date using the Intl API and your configured timezone.
 * Defaults to `YYYY-MM-DD` if no options are passed.
 */
function formatDate(
  date = new Date(),
  options: Intl.DateTimeFormatOptions = DEFAULT_OPTIONS,
  locale = 'en-US',
  timeZone = config.app.timeZone
): string {
  const formatter = new Intl.DateTimeFormat(locale, { ...options, timeZone });
  return formatter.format(date);
}

export const DateUtils = {
  getLocalHour,
  getLocalTimestamp,
  getTodayDateString,
  formatDate,
};
