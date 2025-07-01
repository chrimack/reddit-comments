import { config } from '@/config';
import type { RedditComment, RedditListing, UserComment } from '@/reddit/types';
import { RedditMapper } from './reddit.mapper.ts';

function processRedditComments(redditComments: RedditComment[]): UserComment[] {
  return redditComments
    .filter((comment) => config.app.users.includes(comment.author))
    .map((comment) => RedditMapper.fromRedditComment(comment));
}

function getNewOrUpdatedComments(
  cachedMap: Map<string, UserComment>,
  current: UserComment[]
): UserComment[] {
  return current.filter((comment) => {
    const cachedComment = cachedMap.get(comment.id);

    if (!cachedComment) return true; // New comment
    if (comment.edited && !cachedComment.edited) return true; // Newly edited comment
    if (comment.body !== cachedComment.body) return true; // Updated comment

    return false;
  });
}

function filterCommentsBySubreddit(
  listing: RedditListing<RedditComment>,
  subreddit: string
): UserComment[] {
  return listing.data.children
    .map((child) => child.data)
    .filter((child) => child.subreddit.toLowerCase() === subreddit)
    .map(RedditMapper.fromRedditComment);
}

export const RedditUtils = {
  processRedditComments,
  getNewOrUpdatedComments,
  filterCommentsBySubreddit,
};
