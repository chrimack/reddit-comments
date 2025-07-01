import { FileCache } from '@/cache';
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
  const cached = FileCache.get<UserComment[]>(config.cache.comments) ?? [];
  const cacheMap = new Map(cached.map((c) => [c.id, c]));

  const updated: UserComment[] = [];
  const all: UserComment[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const username = usernames[i];

    if (result.status === 'fulfilled') {
      const listing = result.value;
      const filtered = RedditUtils.filterCommentsBySubreddit(
        listing,
        config.app.subreddit
      );
      all.push(...filtered);

      const newOrUpdated = RedditUtils.getNewOrUpdatedComments(
        cacheMap,
        filtered
      );
      updated.push(...newOrUpdated);
    } else {
      Logger.error(
        `Failed to fetch comments for user: ${username}`,
        result.reason
      );
    }
  }

  return { all, updated };
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

export const RedditService = {
  getUserComments,
};
