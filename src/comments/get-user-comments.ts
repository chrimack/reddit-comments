import { config } from '../config/index.ts';
import type { RedditComment, RedditCommentResponse } from '../types/index.ts';

export async function getUserComments(
  username: string,
  accessToken: string,
  params: Record<string, string> = { limit: '1' }
): Promise<RedditComment[]> {
  const url = new URL(`https://oauth.reddit.com/user/${username}/comments`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

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
      `Error fetching comments for user ${username}:`,
      response.statusText
    );
    throw new Error(`Failed to fetch comments: ${response.statusText}`);
  }

  const json: RedditCommentResponse = await response.json();

  return json.data.children.map((child) => child.data);
}
