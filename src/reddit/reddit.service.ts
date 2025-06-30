import { FileCache } from '@/cache';
import { config } from '@/config';
import { LeagueUtils, type League } from '@/leagues';
import type {
  PostMeta,
  UserComment,
  UserCommentSyncResult,
} from '@reddit/types';
import { RedditClient } from './reddit.client.ts';
import { RedditUtils } from './reddit.utils.ts';

async function getPostByTitle(
  league: League,
  subreddit = 'sportsbook'
): Promise<PostMeta> {
  const cachedPost = FileCache.get<PostMeta>(config.cache.posts, league);
  const title = LeagueUtils.getPostTitle(league);

  if (cachedPost) return cachedPost;
  const redditClient = new RedditClient();
  const post = await redditClient.fetchPostByTitle(title, subreddit);
  FileCache.set<PostMeta>(config.cache.posts, post, league);

  return post;
}

export async function getPostComments(
  permalink: string,
  league: League
): Promise<UserCommentSyncResult> {
  const cachedComments =
    FileCache.get<UserComment[]>(config.cache.comments, league) ?? [];

  const redditClient = new RedditClient();
  const redditComments = await redditClient.fetchPostComments(permalink);
  const currentComments = RedditUtils.processRedditComments(redditComments);
  const updatedComments = RedditUtils.getNewOrUpdatedComments(
    cachedComments,
    currentComments
  );

  FileCache.set<UserComment[]>(config.cache.comments, currentComments, league);

  return {
    updated: updatedComments,
    all: currentComments,
  };
}

export const RedditService = {
  getPostByTitle,
  getPostComments,
};
