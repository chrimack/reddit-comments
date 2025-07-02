import { Cleanup, FileCache } from '@/cache';
import { config } from '@/config';
import { Logger } from '@/logger';
import { NtfyService } from '@/ntfy';
import { RedditService } from '@/reddit';
import { isWithinTimeWindow } from './scheduler.ts';

let isRunning = false;
let errorCount = 0;
const MAX_ERRORS = 3;

async function monitorUserComments() {
  if (isRunning) return;
  isRunning = true;

  await RedditService.init();

  try {
    const comments = await RedditService.getUserComments();

    await Promise.allSettled(
      comments.updated.map((comment) =>
        NtfyService.sendCommentNotification({
          permalink: comment.permalink,
          username: comment.author,
        })
      )
    );

    Logger.log('Successfully finished polling user comments');
    Logger.flushLogsToFile();
  } catch (error) {
    errorCount++;
    Logger.error(`Failed to run watcher`, error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    await NtfyService.sendErrorNotification(`Watcher failed: ${errorMessage}`);

    if (errorCount >= MAX_ERRORS) {
      await NtfyService.sendErrorNotification(
        `Max error limit reached: ${errorCount}, shutting down...`
      );
      Deno.exit(1);
    }
  } finally {
    isRunning = false;
  }
}

export function startRedditWatcher(): void {
  if (!isWithinTimeWindow()) return;

  Logger.log(`Starting Reddit Watcher polling...`);

  if (Cleanup.shouldRunCleanup()) {
    Object.values(config.cache).forEach((filePath: string) =>
      FileCache.cleanup(filePath)
    );
    Cleanup.markCleanupRan();
  }

  monitorUserComments();
}
