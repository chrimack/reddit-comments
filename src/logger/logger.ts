import * as path from 'https://deno.land/std/path/mod.ts';
import type { OperationStats } from './types.ts';

export class Logger {
  private static instance: Logger;
  private logBuffer: string[] = [];

  private constructor() {}

  public static getInstance() {
    if (!this.instance) this.instance = new Logger();
    return this.instance;
  }

  private getISOTimestamp = () => new Date().toISOString();

  private formatLogLine(
    level: 'INFO' | 'WARN' | 'ERROR',
    message: string,
    ...args: unknown[]
  ) {
    const pad = level === 'ERROR' ? '' : ' ';
    return `[${level}]${pad} ${this.getISOTimestamp()} — ${message} ${args
      .map(String)
      .join(' ')}`;
  }

  public log(message: string, ...args: unknown[]) {
    const logLine = this.formatLogLine('INFO', message, ...args);
    console.log(logLine);
    this.logBuffer.push(logLine);
  }

  public warn(message: string, ...args: unknown[]) {
    const logLine = this.formatLogLine('WARN', message, ...args);
    console.warn(logLine);
    this.logBuffer.push(logLine);
  }

  public error(message: string, ...args: unknown[]) {
    const logLine = this.formatLogLine('ERROR', message, ...args);
    console.error(logLine);
    this.logBuffer.push(logLine);
  }

  public logSummary(
    userStats: OperationStats,
    notificationStats: OperationStats,
    startTime: number
  ) {
    const totalUsers = userStats.success + userStats.failed;
    const durationMs = Date.now() - startTime;

    this.log(
      `Finished polling ${totalUsers} users, ${userStats.failed} failed`
    );
    this.log(
      `Notifications sent: ${notificationStats.success} successful, ${notificationStats.failed} failed`
    );
    this.log(`Polling complete in ${durationMs / 1000}s`);
  }

  public async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return;
    const date = this.getISOTimestamp().split('T')[0];
    const filePath = `./logs/${date}.txt`;

    const dir = path.dirname(filePath);
    await Deno.mkdir(dir, { recursive: true });

    const separator = `\n----- Log batch flush at ${this.getISOTimestamp()} -----\n`;
    const data = separator + this.logBuffer.join('\n') + '\n';

    try {
      await Deno.writeTextFile(filePath, data, { append: true });
      this.logBuffer.length = 0;
    } catch (error) {
      console.error('Failed to write logs to file: ', error);
    }
  }
}
