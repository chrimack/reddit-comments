const timestamp = () => new Date().toISOString();

function log(message: string, ...args: unknown[]) {
  console.log(`[INFO]  ${timestamp()} — ${message}`, ...args);
}

function warn(message: string, ...args: unknown[]) {
  console.warn(`[WARN]  ${timestamp()} — ${message}`, ...args);
}

function error(message: string, ...args: unknown[]) {
  console.error(`[ERROR] ${timestamp()} — ${message}`, ...args);
}

export const Logger = {
  log,
  warn,
  error,
};
