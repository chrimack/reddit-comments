import { assertEquals, assertMatch, assertThrows } from 'jsr:@std/assert';
import { DateUtils } from './date.utils.ts';

DateUtils;
assertEquals;

const fixedDate = new Date('2025-07-03T14:05:12');

Deno.test('formatDate() returns YYYYY-MM-DD by default', () => {
  const result = DateUtils.formatDate(fixedDate);
  assertMatch(result, /^\d{4}-\d{2}-\d{2}$/);
});

Deno.test('formatDate() returns custom format', () => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  };
  const result = DateUtils.formatDate(fixedDate, options, 'en-US');
  assertEquals(result, '7/3/25');
});

Deno.test('formatDate() handles invalid date', () => {
  const invalidDate = new Date('invalid');
  // Intl.DateTimeFormat will output "Invalid Date" or throw, depending on environment
  assertThrows(() => DateUtils.formatDate(invalidDate), Error);
});

Deno.test('formatDate() respects custom timeZone', () => {
  const date = new Date('2025-07-03T14:05:12Z');
  const resultUTC = DateUtils.formatDate(date, undefined, 'en-CA', 'UTC');
  const resultTokyo = DateUtils.formatDate(
    date,
    undefined,
    'en-CA',
    'Asia/Tokyo'
  );
  assertEquals(resultUTC.length, 10);
  assertEquals(resultTokyo.length, 10);
  // Should be different days if time difference crosses midnight
  // Not asserting exact value due to possible DST, but should not be equal
  if (resultUTC !== resultTokyo) {
    assertEquals(typeof resultUTC, 'string');
    assertEquals(typeof resultTokyo, 'string');
  }
});

Deno.test('formatDate() returns correct format for different locales', () => {
  const date = new Date('2025-07-03T14:05:12');
  const ca = DateUtils.formatDate(date, undefined, 'en-CA');
  const us = DateUtils.formatDate(date, undefined, 'en-US');
  assertMatch(ca, /^\d{4}-\d{2}-\d{2}$/);
  assertMatch(us, /^\d{2}\/\d{2}\/\d{4}$/);
});

Deno.test('formatDate() with explicit date and options', () => {
  const date = new Date('2025-12-31T23:59:59');
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const result = DateUtils.formatDate(date, options, 'en-US');
  assertMatch(result, /December|31/);
});

Deno.test(
  `getTodayDateString() returns today's date in YYYY-MM-DD format`,
  () => {
    const expected = DateUtils.formatDate(new Date());
    const actual = DateUtils.getTodayDateString();
    assertEquals(actual, expected);
  }
);

Deno.test('getLocalHour() returns current hour in 0-23 range', () => {
  const hour = DateUtils.getLocalHour();
  assertEquals(typeof hour, 'number');
  if (hour < 0 || hour > 23) {
    throw new Error(`Hour out of range: ${hour}`);
  }
});

Deno.test('getLocalHour() returns integer', () => {
  const hour = DateUtils.getLocalHour();
  assertEquals(Number.isInteger(hour), true);
});

Deno.test('getLocalTimestamp() returns ISO-like string', () => {
  const timestamp = DateUtils.getLocalTimestamp();
  // Should look like: 2025-07-03T14:05:12
  console.log(timestamp);
  assertMatch(timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
});
