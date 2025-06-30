import { config } from '@/config';
import type { RedditComment, UserComment } from '@reddit/types';
import { RedditMapper } from './reddit.mapper.ts';

function processRedditComments(redditComments: RedditComment[]): UserComment[] {
  return redditComments
    .filter((comment) => config.app.users.includes(comment.author))
    .map((comment) => RedditMapper.fromRedditComment(comment));
}

function getNewOrUpdatedComments(
  cached: UserComment[],
  current: UserComment[]
): UserComment[] {
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
