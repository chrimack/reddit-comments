import { CacheManager, CleanupManager } from '@/cache';
import { config } from '@/config';
import { Logger } from '@/logger';
import { NtfyService } from '@/ntfy';
import { RedditService } from '@/reddit';
import { isWithinTimeWindow } from './scheduler.ts';

let isRunning = false;
let errorCount = 0;
const MAX_ERRORS = 3;

async function monitorUserComments() {
  const startTime = Date.now();

  if (isRunning) return;
  isRunning = true;

  await RedditService.init();

  try {
    const comments = await RedditService.getUserComments();
    const notificationStats = await NtfyService.sendNotifications(
      comments.updated
    );

    Logger.logSummary(comments.stats, notificationStats, startTime);
    await Logger.flush();
  } catch (error) {
    errorCount++;
    Logger.error(`Failed to run watcher`, error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    await NtfyService.sendErrorNotification(`Watcher failed: ${errorMessage}`);

    if (errorCount >= MAX_ERRORS) {
      await NtfyService.sendErrorNotification(
        `Max error limit reached: ${errorCount}, shutting down...`
      );

      const durationMs = Date.now() - startTime;
      Logger.log(`Polling complete in ${durationMs / 1000}s`);
      Deno.exit(1);
    }
  } finally {
    isRunning = false;
  }
}

export function startRedditWatcher(): void {
  if (!isWithinTimeWindow()) return;

  Logger.log(`Starting Reddit Watcher polling...`);

  const cleanup = new CleanupManager();
  if (cleanup.shouldRunCleanup()) {
    Object.values(config.cache).forEach((filePath: string) =>
      new CacheManager(filePath).cleanup()
    );
    cleanup.markCleanupRan();
  }

  monitorUserComments();
}
