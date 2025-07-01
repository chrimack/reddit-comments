import {
  runNowAndSchedule,
  setupShutdownHandlers,
  startRedditWatcher,
} from '@/app/index.ts';
import { Logger } from '@/logger';

const every10Minutes = '*/10 * * * *';

runNowAndSchedule(every10Minutes, () => {
  Logger.log('Running Reddit Watcher');
  startRedditWatcher();
});

setupShutdownHandlers();
