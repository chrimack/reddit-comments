import { RedditMapper } from './reddit.mapper.ts';
import type { RedditComment } from './types/reddit.ts';

function processRedditComments(redditComments: RedditComment[]): Comment[] {
  return redditComments
    .filter((comment) => config.app.users.includes(comment.author))
    .map((comment) => RedditMapper.fromRedditComment(comment));
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

export const RedditUtils = {
  processRedditComments,
  getNewOrUpdatedComments,
};
