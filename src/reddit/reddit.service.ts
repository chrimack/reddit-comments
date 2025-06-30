import { FileCache } from '@/cache';
import { config } from '@/config';
import type {
  PostMeta,
  UserComment,
  UserCommentSyncResult,
} from '@reddit/types';
import { RedditClient } from './reddit.client.ts';
import { RedditUtils } from './reddit.utils.ts';

async function getPostByTitle(
  title: string,
  subreddit = 'sportsbook'
): Promise<PostMeta> {
  const cachedPost = FileCache.get<PostMeta>(config.cache.posts);

  if (cachedPost) return cachedPost;
  const redditClient = new RedditClient();
  const post = await redditClient.fetchPostByTitle(title, subreddit);
  FileCache.set<PostMeta>(config.cache.posts, post);

  return post;
}

export async function getPostComments(
  permalink: string
): Promise<UserCommentSyncResult> {
  const cachedComments =
    FileCache.get<UserComment[]>(config.cache.comments) ?? [];

  const redditClient = new RedditClient();
  const redditComments = await redditClient.fetchPostComments(permalink);
  const currentComments = RedditUtils.processRedditComments(redditComments);
  const updatedComments = RedditUtils.getNewOrUpdatedComments(
    cachedComments,
    currentComments
  );

  FileCache.set<UserComment[]>(config.cache.comments, currentComments);

  return {
    updated: updatedComments,
    all: currentComments,
  };
}

export const RedditService = {
  getPostByTitle,
  getPostComments,
};
