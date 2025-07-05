import { CacheManager } from '@/cache';
import { config } from '@/config';
import { Logger } from '@/logger';
import type {
  RedditComment,
  RedditListing,
  UserComment,
  UserCommentSyncResult,
} from '@/reddit/types';
import { DiffUtils } from '@/utils';
import { RedditClient } from './reddit.client.ts';
import { RedditUtils } from './reddit.utils.ts';

export class RedditService {
  constructor(
    private redditClient = RedditClient.getInstance(),
    private logger = Logger.getInstance()
  ) {}

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

    const newComments: UserComment[] = [];
    const updated: UserComment[] = [];
    const all: UserComment[] = [];
    let success = 0;
    let failed = 0;

    const allRedditComments: RedditComment[] = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const username = usernames[i];

      if (result.status === 'fulfilled') {
        const listing = result.value;
        const { redditComments, userComments } =
          RedditUtils.getTodayTopLevelComments(listing, config.app.subreddit);
        all.push(...userComments);
        allRedditComments.push(...redditComments);

        const { new: currentNew, updated: currentUpdated } =
          RedditUtils.getNewAndUpdatedComments(cacheMap, userComments);
        newComments.push(...currentNew);
        updated.push(...currentUpdated);

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

    const updatedWithDiffs: UserComment[] = updated.map((comment) => {
      const cached = cacheMap.get(comment.id);
      const diffPreview = DiffUtils.getCommentDiff(
        cached?.body ?? '',
        comment.body
      );

      return {
        ...comment,
        diffPreview,
      };
    });

    new CacheManager<RedditComment[]>('./cache/reddit-comments.json').set(
      allRedditComments
    );

    cacheManager.set(all);

    return {
      all,
      new: newComments,
      updated: updatedWithDiffs,
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
