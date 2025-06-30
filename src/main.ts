import { runNowAndSchedule, startRedditWatcher } from '@/app/index.ts';
import { Logger } from '@/logger';

const every10Minutes = '*/10 * * * *';

runNowAndSchedule(every10Minutes, () => {
  Logger.log('Running Reddit Watcher');
  startRedditWatcher();
});

Deno.addSignalListener('SIGINT', () => {
  Logger.log('Shutting down...');
  Deno.exit();
});
