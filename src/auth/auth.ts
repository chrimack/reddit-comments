import { config } from '../config/index.ts';
import type { AccessTokenResponse } from '../types/index.ts';

let accessTokenCache: {
  token: string;
  expiresAt: number;
} | null = null;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (accessTokenCache && accessTokenCache.expiresAt > now) {
    return accessTokenCache.token;
  }

  const response = await fetchAccessToken();
  const expiresAt = now + response.expires_in * 1000 - 5000; // Subtract 5 seconds for safety

  accessTokenCache = {
    token: response.access_token,
    expiresAt,
  };

  return response.access_token;
}

async function fetchAccessToken(): Promise<AccessTokenResponse> {
  const { clientId, clientSecret, password, username, userAgent } = config;
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
  });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: body.toString(),
  });

  if (!response.ok) {
    console.error(
      `Error fetching access token: ${response.status} ${response.statusText}`
    );
    throw new Error(`Failed to fetch access token: ${response.statusText}`);
  }

  return response.json();
}
