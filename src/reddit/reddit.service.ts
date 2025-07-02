import { CacheManager } from '@/cache';
import { config } from '@/config';
import { Logger } from '@/logger';
import type {
  RedditComment,
  RedditListing,
  UserComment,
  UserCommentSyncResult,
} from '@/reddit/types';
import { RedditClient } from './reddit.client.ts';
import { RedditUtils } from './reddit.utils.ts';

function handleUserCommentResults(
  results: PromiseSettledResult<RedditListing<RedditComment>>[],
  usernames: string[]
): UserCommentSyncResult {
  const cacheManager = new CacheManager<UserComment[]>(config.cache.comments);
  const cached = cacheManager.get() ?? [];
  const cacheMap = new Map(cached.map((c) => [c.id, c]));

  const updated: UserComment[] = [];
  const all: UserComment[] = [];
  let success = 0;
  let failed = 0;

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const username = usernames[i];

    if (result.status === 'fulfilled') {
      const listing = result.value;
      const filtered = RedditUtils.getTodayTopLevelComments(
        listing,
        config.app.subreddit
      );
      all.push(...filtered);

      const newOrUpdated = RedditUtils.getNewOrUpdatedComments(
        cacheMap,
        filtered
      );
      updated.push(...newOrUpdated);

      success++;
      Logger.log(`Fetched and diffed comments for: ${username}`);
    } else {
      failed++;
      Logger.error(
        `Failed to fetch comments for user: ${username}`,
        result.reason
      );
    }
  }

  cacheManager.set(all);

  return {
    all,
    updated,
    stats: { failed, success },
  };
}

async function getUserComments(): Promise<UserCommentSyncResult> {
  const redditClient = RedditClient.getInstance();

  const userCommentPromises = config.app.users.map((username) => ({
    username,
    promise: redditClient.getUserComments(username),
  }));

  const results = await Promise.allSettled(
    userCommentPromises.map((user) => user.promise)
  );

  return handleUserCommentResults(
    results,
    userCommentPromises.map((user) => user.username)
  );
}

async function init(): Promise<void> {
  await RedditClient.getInstance().init();
  Logger.log(`${RedditClient.name} successfully initialized`);
}

export const RedditService = {
  getUserComments,
  init,
};
