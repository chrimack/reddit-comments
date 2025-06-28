import { config } from '../config/index.ts';
import type { PostMeta } from '../types/index.ts';
import { getFromCache, setCache } from '../utils/index.ts';

export async function getPostByTitle(
  subreddit = 'sportsbook',
  title: string,
  accessToken: string
): Promise<PostMeta> {
  const cachedPost = getFromCache<PostMeta>(config.cache.posts);

  if (cachedPost) return cachedPost;

  const post = await fetchPostByTitle(subreddit, title, accessToken);
  setCache<PostMeta>(config.cache.posts, post);

  return post;
}

async function fetchPostByTitle(
  subreddit = 'sportsbook',
  title: string,
  accessToken: string
): Promise<PostMeta> {
  const url = new URL(`https://oauth.reddit.com/r/${subreddit}/search`);
  url.searchParams.append('q', title);
  url.searchParams.append('restrict_sr', 'true');
  url.searchParams.append('sort', 'new');
  url.searchParams.append('limit', '1');

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
      `Error fetching post by title "${title}": ${response.statusText}`
    );
    throw new Error(`Failed to fetch post: ${response.statusText}`);
  }

  const json = await response.json();
  const post = json.data.children[0]?.data;
  if (!post) {
    console.error(
      `Post with title "${title}" not found in subreddit "${subreddit}"`
    );
    throw new Error(`Post not found: ${title}`);
  }
  return {
    id: post.id,
    permalink: post.permalink,
  };
}
