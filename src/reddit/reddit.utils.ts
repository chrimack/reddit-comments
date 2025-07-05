import { config } from '@/config';
import type { RedditComment, RedditListing, UserComment } from '@/reddit/types';
import { DateUtils } from '@/utils';
import { RedditMapper } from './reddit.mapper.ts';

function processRedditComments(redditComments: RedditComment[]): UserComment[] {
  return redditComments
    .filter((comment) => config.app.users.includes(comment.author))
    .map((comment) => RedditMapper.fromRedditComment(comment));
}

function getNewAndUpdatedComments(
  cachedMap: Map<string, UserComment>,
  current: UserComment[]
): { new: UserComment[]; updated: UserComment[] } {
  const newComments: UserComment[] = [];
  const updatedComments: UserComment[] = [];
  const acc = { new: newComments, updated: updatedComments };

  current.reduce((acc, comment) => {
    const cachedComment = cachedMap.get(comment.id);

    if (!cachedComment) {
      acc.new.push(comment);
    } else if (
      (comment.edited && !cachedComment.edited) ||
      comment.body !== cachedComment.body
    ) {
      acc.updated.push(comment);
    }

    return acc;
  }, acc);

  return { new: newComments, updated: updatedComments };
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
): { redditComments: RedditComment[]; userComments: UserComment[] } {
  const redditComments = listing.data.children
    .map((child) => child.data)
    .filter(
      (child) =>
        child.subreddit.toLowerCase() === subreddit && // only get comments from r/sportsbook
        child.link_title.includes(getDateInfo()) && // only get coments from today's posts
        child.parent_id.startsWith('t3') // only get top-level comments
    );

  return {
    redditComments,
    userComments: redditComments.map(RedditMapper.fromRedditComment),
  };
}

export const RedditUtils = {
  processRedditComments,
  getDateInfo,
  getNewAndUpdatedComments,
  getTodayTopLevelComments,
};
