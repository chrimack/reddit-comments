import { config } from '../config/index.ts';
import type { RedditComment } from '../types/index.ts';

export async function getPostComments(
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
  const commentListing = json[1]?.data?.children || [];

  for (const child of commentListing) {
    if (child.kind === 't1') {
      comments.push(child.data);
    }
  }

  return comments;
}
