import { Logger } from '@/logger';
import { cron } from 'https://deno.land/x/deno_cron/cron.ts';

export function runNowAndSchedule(
  cronExpr: string,
  fn: () => void | Promise<void>
): void {
  Logger.log('Starting initial run...');
  fn();
  cron(cronExpr, fn);
}
