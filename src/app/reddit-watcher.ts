import { Cleanup, FileCache } from '@/cache';
import { config } from '@/config';
import { Logger } from '@/logger';
import { NtfyService } from '@/ntfy';
import { RedditService } from '@/reddit';

let isRunning = false;

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
  } catch (error) {
    Logger.error(`Failed to run watcher`, error);
  } finally {
    isRunning = false;
  }
}

export function startRedditWatcher(): void {
  Logger.log(`Starting Reddit Watcher polling...`);

  if (Cleanup.shouldRunCleanup()) {
    Object.values(config.cache).forEach((filePath: string) =>
      FileCache.cleanup(filePath)
    );
    Cleanup.markCleanupRan();
  }

  monitorUserComments();
}
