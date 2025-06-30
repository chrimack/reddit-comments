import { config } from '../config/index.ts';
import { RedditClient } from '../http-client/index.ts';
import type { PostMeta } from '../types/index.ts';
import { getFromCache, setCache } from '../utils/index.ts';

export async function getPostByTitle(
  subreddit = 'sportsbook',
  title: string
): Promise<PostMeta> {
  const cachedPost = getFromCache<PostMeta>(config.cache.posts);

  if (cachedPost) return cachedPost;
  const redditClient = new RedditClient();
  const post = await redditClient.fetchPostByTitle(title, subreddit);
  setCache<PostMeta>(config.cache.posts, post);

  return post;
}
