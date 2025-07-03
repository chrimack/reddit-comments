import { Logger } from '@/logger';

import { cron } from 'https://deno.land/x/deno_cron/cron.ts';

export function runNowAndSchedule(
  cronExpr: string,
  fn: () => void | Promise<void>
): void {
  Logger.getInstance().log('Starting initial run...');
  fn();
  cron(cronExpr, fn);
}

export function isWithinTimeWindow(): boolean {
  const easternTimeZone = 'America/New_York';
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone: easternTimeZone,
  });

  const hour = Number(formatter.format(now));

  return hour >= 7 && hour <= 20;
}
