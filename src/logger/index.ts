import * as path from 'https://deno.land/std/path/mod.ts';

const logBuffer: string[] = [];

const getISOTimestamp = () => new Date().toISOString();
function formatLogLine(
  level: 'INFO' | 'WARN' | 'ERROR',
  message: string,
  ...args: unknown[]
) {
  const pad = level === 'ERROR' ? '' : ' ';
  return `[${level}]${pad} ${getISOTimestamp()} — ${message} ${args
    .map(String)
    .join(' ')}`;
}

function log(message: string, ...args: unknown[]) {
  const logLine = formatLogLine('INFO', message, ...args);
  console.log(logLine);
  logBuffer.push(logLine);
}

function warn(message: string, ...args: unknown[]) {
  const logLine = formatLogLine('WARN', message, ...args);
  console.warn(logLine);
  logBuffer.push(logLine);
}

function error(message: string, ...args: unknown[]) {
  const logLine = formatLogLine('ERROR', message, ...args);
  console.error(logLine);
  logBuffer.push(logLine);
}

async function flushLogsToFile(): Promise<void> {
  if (logBuffer.length === 0) return;
  const date = getISOTimestamp().split('T')[0];
  const filePath = `./logs/${date}.txt`;

  const dir = path.dirname(filePath);
  await Deno.mkdir(dir, { recursive: true });

  const separator = `\n----- Log batch flush at ${getISOTimestamp()} -----\n`;
  const data = separator + logBuffer.join('\n') + '\n';

  try {
    await Deno.writeTextFile(filePath, data, { append: true });
    logBuffer.length = 0;
  } catch (error) {
    console.error('Failed to write logs to file: ', error);
  }
}

export const Logger = {
  log,
  warn,
  error,
  flushLogsToFile,
};
