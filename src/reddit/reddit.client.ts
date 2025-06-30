import { config } from '@/config';
import { HttpClient } from '@/http';
import { Logger } from '@/logger';
import type {
  AccessTokenResponse,
  PostMeta,
  RedditComment,
  RedditListing,
  RedditPost,
} from '@/reddit/types';

export class RedditClient {
  private client: HttpClient;
  private tokenCache: { token: string; expiresAt: number } | null = null;

  constructor() {
    this.client = new HttpClient('https://oauth.reddit.com');
  }

  public async fetchPostByTitle(
    title: string,
    subreddit = 'sportsbook'
  ): Promise<PostMeta> {
    const path = `/r/${subreddit}/search`;
    const query = {
      q: title,
      restrict_sr: 'true',
      sort: 'new',
      limit: '1',
    };
    const headers = await this.createHeaders();

    try {
      const res = await this.client.get<RedditListing<RedditPost>>(path, {
        query,
        headers,
      });

      const post = res.data.children.at(0)?.data;

      if (!post) {
        console.error(
          `Post with title "${title}" not found in subreddit "${subreddit}"`
        );
        throw new Error(
          `Post with title "${title}" not found in subreddit "${subreddit}"`
        );
      }

      const postMeta: PostMeta = {
        id: post.id,
        permalink: post.permalink,
        title: post.title,
      };

      Logger.log(`Successfully fetched post: ${JSON.stringify(postMeta)}`);
      return postMeta;
    } catch (error) {
      Logger.error('Error fetching post: ', error);
      throw error;
    }
  }

  public async fetchPostComments(permalink: string): Promise<RedditComment[]> {
    const path = `${permalink}.json`;

    const headers = await this.createHeaders();

    try {
      const res = await this.client.get<
        [unknown, RedditListing<RedditComment>]
      >(path, {
        headers,
      });

      const commentListing = res?.[1]?.data.children ?? [];

      const redditComments = commentListing
        .filter((child) => child.kind === 't1') // t1 = comment
        .map((child) => child.data);

      Logger.log(`Successfully fetched ${redditComments.length} comments`);
      return redditComments;
    } catch (error) {
      Logger.error(`Failed to fetch post comments for ${permalink}`);
      throw error;
    }
  }

  private async createHeaders(): Promise<Headers> {
    const accessToken = await this.getAccessToken();
    const headers = new Headers({
      'User-Agent': config.userAgent,
      Authorization: `Bearer ${accessToken}`,
    });
    return headers;
  }

  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.tokenCache && this.tokenCache.expiresAt > now) {
      Logger.log('Token reused from cache');
      return this.tokenCache.token;
    }

    try {
      const response = await this.fetchAccessToken();
      const expiresAt = now + response.expires_in * 1000 - 5000; // Subtract 5 seconds for safety
      this.tokenCache = {
        token: response.access_token,
        expiresAt,
      };

      Logger.log('Successfully received access token');
      return response.access_token;
    } catch (error) {
      Logger.error(`Error fetching access token`);
      throw error;
    }
  }

  private async fetchAccessToken(): Promise<AccessTokenResponse> {
    const { auth, userAgent } = config;
    const { clientId, clientSecret, username, password } = auth;
    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    const url = new URL('https://www.reddit.com/api/v1/access_token');

    const headers = new Headers({
      Authorization: `Basic ${basicAuth}`,
      'User-Agent': userAgent,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams({
      grant_type: 'password',
      username,
      password,
      scope: 'read',
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: body.toString(),
    });

    if (!response.ok) {
      Logger.error(
        `Error fetching access token: ${response.status} ${response.statusText}`
      );
      throw new Error(`Failed to fetch access token: ${response.statusText}`);
    }

    return response.json();
  }
}
