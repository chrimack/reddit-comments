import { RedditClient } from './reddit.client.ts';
import { RedditUtils } from './reddit.utils.ts';
import type { PostMeta } from './types/post-meta.ts';

async function getPostByTitle(
  subreddit = 'sportsbook',
  title: string
): Promise<PostMeta> {
  const cachedPost = CacheUtils.getFromCache<PostMeta>(config.cache.posts);

  if (cachedPost) return cachedPost;
  const redditClient = new RedditClient();
  const post = await redditClient.fetchPostByTitle(title, subreddit);
  CacheUtils.setCache<PostMeta>(config.cache.posts, post);

  return post;
}

export async function getPostComments(
  permalink: string
): Promise<{ updated: Comment[]; all: Comment[] }> {
  const cachedComments =
    CacheUtils.getFromCache<Comment[]>(config.cache.comments) ?? [];

  const redditClient = new RedditClient();
  const redditComments = await redditClient.fetchPostComments(permalink);
  const currentComments = RedditUtils.processRedditComments(redditComments);
  const updatedComments = RedditUtils.getNewOrUpdatedComments(
    cachedComments,
    currentComments
  );

  CacheUtils.setCache<Comment[]>(config.cache.comments, currentComments);

  return {
    updated: updatedComments,
    all: currentComments,
  };
}

export const RedditService = {
  getPostByTitle,
  getPostComments,
};
