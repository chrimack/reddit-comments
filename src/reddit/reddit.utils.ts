import { config } from '@/config';
import type { RedditComment, RedditListing, UserComment } from '@/reddit/types';
import { DateUtils } from '@/utils';
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

function getDateInfo(): string {
  const date = new Date();
  const month = DateUtils.formatDate(date, { month: 'numeric' });
  const day = DateUtils.formatDate(date, { day: 'numeric' });
  const year = DateUtils.formatDate(date, { year: '2-digit' });
  const weekday = DateUtils.formatDate(date, { weekday: 'long' });
  return `${month}/${day}/${year} (${weekday})`;
}

function getTodayTopLevelComments(
  listing: RedditListing<RedditComment>,
  subreddit: string
): UserComment[] {
  const redditComments = listing.data.children
    .map((child) => child.data)
    .filter(
      (child) =>
        child.subreddit.toLowerCase() === subreddit && // only get comments from r/sportsbook
        child.link_title.includes(getDateInfo()) && // only get coments from today's posts
        child.parent_id.startsWith('t3') // only get top-level comments
    );

  return redditComments.map(RedditMapper.fromRedditComment);
}

export const RedditUtils = {
  processRedditComments,
  getNewOrUpdatedComments,
  getTodayTopLevelComments,
};
