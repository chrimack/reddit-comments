import { CacheManager, CleanupManager } from '@/cache';
import { config } from '@/config';
import { Logger } from '@/logger';
import { NtfyService } from '@/ntfy';
import { RedditService } from '@/reddit';
import { isWithinTimeWindow } from './scheduler.ts';

let isRunning = false;
let errorCount = 0;
const MAX_ERRORS = 3;

async function handlePollingError(
  error: unknown,
  logger: Logger,
  ntfyService: NtfyService,
  startTime: number
): Promise<void> {
  errorCount++;
  logger.error(`Failed to run watcher`, error);

  const errorMessage = error instanceof Error ? error.message : String(error);
  await ntfyService.sendErrorNotification(`Watcher failed: ${errorMessage}`);

  if (errorCount >= MAX_ERRORS) {
    await ntfyService.sendErrorNotification(
      `Max error limit reached: ${errorCount}, shutting down...`
    );

    const durationMs = Date.now() - startTime;
    logger.log(`Polling complete in ${durationMs / 1000}s`);
    logger.flush().finally(() => Deno.exit(1));
  }
}

function runCleanup() {
  const cleanup = new CleanupManager();
  if (cleanup.shouldRunCleanup()) {
    Object.values(config.cache).forEach((filePath: string) =>
      new CacheManager(filePath).cleanup()
    );
    cleanup.markCleanupRan();
  }
}

async function monitorUserComments() {
  const startTime = Date.now();

  if (isRunning) return;
  isRunning = true;

  const logger = Logger.getInstance();
  const redditService = new RedditService();
  const ntfyService = new NtfyService();

  await redditService.init();

  try {
    const comments = await redditService.getUserComments();
    const notificationStats = await ntfyService.sendCommentNotifications(
      comments.new,
      comments.updated
    );

    logger.logSummary(comments.stats, notificationStats, startTime);
    await logger.flush();
  } catch (error) {
    await handlePollingError(error, logger, ntfyService, startTime);
  } finally {
    isRunning = false;
  }
}

export function startRedditWatcher(): void {
  const logger = Logger.getInstance();

  if (!isWithinTimeWindow()) {
    logger.log('Outside of app time window');
    return;
  }

  logger.log(`Starting Reddit Watcher polling...`);
  runCleanup();
  monitorUserComments();
}
