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

export class RedditService {
  private redditClient: RedditClient;
  private logger: Logger;

  constructor(redditClient?: RedditClient, logger?: Logger) {
    this.redditClient = redditClient ?? RedditClient.getInstance();
    this.logger = logger ?? Logger.getInstance();
  }

  public async init(): Promise<void> {
    await this.redditClient.init();
    this.logger.log(`${RedditClient.name} successfully initialized`);
  }

  private handleUserCommentResults(
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
        this.logger.log(`Fetched and diffed comments for: ${username}`);
      } else {
        failed++;
        this.logger.error(
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

  public async getUserComments(): Promise<UserCommentSyncResult> {
    const userCommentPromises = config.app.users.map((username) => ({
      username,
      promise: this.redditClient.getUserComments(username),
    }));

    const results = await Promise.allSettled(
      userCommentPromises.map((user) => user.promise)
    );

    return this.handleUserCommentResults(
      results,
      userCommentPromises.map((user) => user.username)
    );
  }
}
