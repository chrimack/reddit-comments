import { config } from '../config/index.ts';
import { RedditClient } from '../http-client/index.ts';
import type { Comment, RedditComment } from '../types/index.ts';
import { CacheUtils, mapToComment } from '../utils/index.ts';

export async function getPostComments(
  permalink: string
): Promise<{ updated: Comment[]; all: Comment[] }> {
  const cachedComments =
    CacheUtils.getFromCache<Comment[]>(config.cache.comments) ?? [];

  const redditClient = new RedditClient();
  const redditComments = await redditClient.fetchPostComments(permalink);
  const currentComments = processRedditComments(redditComments);
  const updatedComments = getNewOrUpdatedComments(
    cachedComments,
    currentComments
  );

  CacheUtils.setCache<Comment[]>(config.cache.comments, currentComments);

  return {
    updated: updatedComments,
    all: currentComments,
  };
}

function processRedditComments(redditComments: RedditComment[]): Comment[] {
  return redditComments
    .filter((comment) => config.app.users.includes(comment.author))
    .map((comment) => mapToComment(comment));
}

function getNewOrUpdatedComments(
  cached: Comment[],
  current: Comment[]
): Comment[] {
  const cachedMap = new Map(cached.map((c) => [c.id, c]));

  return current.filter((comment) => {
    const cachedComment = cachedMap.get(comment.id);

    if (!cachedComment) return true; // New comment
    if (comment.edited && !cachedComment.edited) return true; // Newly edited comment
    if (comment.body !== cachedComment.body) return true; // Updated comment

    return false;
  });
}
