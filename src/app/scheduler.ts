import { Logger } from '@/logger';

import { config } from '@/config';
import { DateUtils } from '@/utils';
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
  const hour = DateUtils.getLocalHour();

  const { startHour, endHour } = config.app.timeWindow;
  return hour >= startHour && hour <= endHour;
}
