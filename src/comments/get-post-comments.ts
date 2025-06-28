import { config } from '../config/index.ts';
import type { Comment, RedditComment } from '../types/index.ts';
import { setCache } from '../utils/cache.ts';
import { getFromCache, mapToComment } from '../utils/index.ts';

export async function getPostComments(
  permalink: string,
  accessToken: string
): Promise<{ updated: Comment[]; all: Comment[] }> {
  const cachedComments = getFromCache<Comment[]>(config.cache.comments) ?? [];

  const redditComments = await fetchPostComments(permalink, accessToken);
  const currentComments = processRedditComments(redditComments);
  const updatedComments = getNewOrUpdatedComments(
    cachedComments,
    currentComments
  );

  setCache<Comment[]>(config.cache.comments, currentComments);

  return {
    updated: updatedComments,
    all: currentComments,
  };
}

async function fetchPostComments(
  permalink: string,
  accessToken: string
): Promise<RedditComment[]> {
  const url = new URL(`https://oauth.reddit.com${permalink}.json`);
  const headers = new Headers({
    Authorization: `Bearer ${accessToken}`,
    'User-Agent': config.userAgent,
  });

  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    console.error(
      `Error fetching comments for post at ${permalink}: ${response.statusText}`
    );
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }

  const json = await response.json();

  const comments: RedditComment[] = [];
  const commentListing = json[1]?.data?.children ?? [];

  for (const child of commentListing) {
    if (child.kind === 't1') {
      comments.push(child.data);
    }
  }

  return comments;
}

function processRedditComments(redditComments: RedditComment[]): Comment[] {
  const filteredComments = redditComments.filter((comment) =>
    config.app.users.includes(comment.author)
  );

  setCache<RedditComment[]>('./cache/reddit-comments.json', filteredComments);

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
