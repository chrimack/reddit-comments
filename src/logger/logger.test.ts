import { DateUtils } from '@/utils';
import { assertMatch, assertStringIncludes } from 'jsr:@std/assert';
import { Logger } from './logger.ts';

const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
};

function mockConsole() {
  (console.log = () => {}),
    (console.warn = () => {}),
    (console.error = () => {});
}

function restoreConsole() {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
}

Deno.test('Logger.log() formats and buffers an INFO message', () => {
  mockConsole();

  const logger = Logger.getInstance();
  logger['logBuffer'] = [];

  logger.log('Test message', 123);

  const [lastLog] = logger['logBuffer'].slice(-1);
  assertMatch(
    lastLog,
    /^\[INFO\]\s{2}\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2} — Test message 123$/
  );

  restoreConsole();
});

Deno.test('Logger.warn formats and buffers a WARN message', () => {
  mockConsole();

  const logger = Logger.getInstance();
  logger['logBuffer'] = [];

  logger.warn('Something might be wrong');

  const [lastLog] = logger['logBuffer'].slice(-1);
  assertMatch(
    lastLog,
    /^\[WARN\]\s{2}\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2} — .../
  );

  restoreConsole();
});

Deno.test('Logger.error formats and buffers an ERROR message', () => {
  mockConsole();

  const logger = Logger.getInstance();
  logger['logBuffer'] = [];

  logger.error('Something went wrong', { code: 500 });

  const [lastLog] = logger['logBuffer'].slice(-1);
  assertMatch(
    lastLog,
    /^\[ERROR\] \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2} — Something went wrong \[object Object\]$/
  );

  restoreConsole();
});

Deno.test('Logger.flush writes logs to the expected file', async () => {
  mockConsole();

  const logger = Logger.getInstance();
  logger['logBuffer'] = [];

  const tempLogPath = './logs/test-log.txt';

  // Temporarily override the file path logic
  const originalDate = DateUtils.getTodayDateString;
  DateUtils.getTodayDateString = () => 'test-log';
  const originalTimestamp = DateUtils.getLocalTimestamp;
  DateUtils.getLocalTimestamp = () => '2025-07-03T12:00:00';

  logger.log('Flush this message');

  await logger.flush();

  const fileContent = await Deno.readTextFile(tempLogPath);
  assertStringIncludes(fileContent, 'Flush this message');

  // Cleanup
  await Deno.remove(tempLogPath);
  DateUtils.getTodayDateString = originalDate;
  DateUtils.getLocalTimestamp = originalTimestamp;

  restoreConsole();
});
