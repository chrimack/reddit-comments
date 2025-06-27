import { config } from '../config/index.ts';

export async function getAccessToken(): Promise<string> {
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

  const data = await response.json();
  if (!data.access_token) {
    console.error('Access token not found in response:', data);
    throw new Error('Access token not found in response');
  }
  return data.access_token;
}
