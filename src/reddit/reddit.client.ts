import { config } from '@/config';
import { HttpClient } from '@/http';
import { Logger } from '@/logger';
import type {
  AccessTokenResponse,
  RedditComment,
  RedditListing,
  RedditPost,
} from '@/reddit/types';

export class RedditClient {
  private static instance: RedditClient;
  private client: HttpClient;
  private logger = Logger.getInstance();

  private tokenCache: { token: string; expiresAt: number } | null = null;
  private inflightTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = new HttpClient('https://oauth.reddit.com');
  }

  public static getInstance(): RedditClient {
    if (!RedditClient.instance) RedditClient.instance = new RedditClient();
    return RedditClient.instance;
  }

  public async init(): Promise<void> {
    await this.getAccessToken();
  }

  public async searchPosts(
    subreddit: string,
    searchTerm: string
  ): Promise<RedditListing<RedditPost>> {
    const path = `/r/${subreddit}/search`;
    const headers = await this.createHeaders();
    const query = {
      q: searchTerm,
      restrict_sr: 'true',
      sort: 'new',
      limit: '1',
    };

    return this.client.get<RedditListing<RedditPost>>(path, {
      headers,
      query,
    });
  }

  public async getUserComments(
    username: string,
    limit = 100
  ): Promise<RedditListing<RedditComment>> {
    const path = `/user/${username}/comments`;
    const headers = await this.createHeaders();

    return this.client.get<RedditListing<RedditComment>>(path, {
      headers,
      query: { limit },
    });
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
      return this.tokenCache.token;
    }

    if (this.inflightTokenPromise) {
      this.logger.log('Token fetch already in progress, awaiting result');
      return await this.inflightTokenPromise;
    }

    this.inflightTokenPromise = this.fetchAccessToken()
      .then((response) => {
        const expiresAt = now + response.expires_in * 1000 - 5000; // Subtract 5 seconds for safety
        this.tokenCache = {
          token: response.access_token,
          expiresAt,
        };

        this.logger.log('Successfully received access token');
        return response.access_token;
      })
      .catch((error) => {
        this.logger.error(`Error fetching access token`);
        throw error;
      })
      .finally(() => {
        this.inflightTokenPromise = null;
      });

    return await this.inflightTokenPromise;
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
      scope: 'read history',
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: body.toString(),
    });

    if (!response.ok) {
      this.logger.error(
        `Error fetching access token: ${response.status} ${response.statusText}`
      );
      throw new Error(`Failed to fetch access token: ${response.statusText}`);
    }

    return response.json();
  }
}
