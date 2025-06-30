import type { RequestInitWithQuery } from '../types/index.ts';

export class HttpClient {
  constructor(private baseUrl: string) {}

  private async request<T = unknown>(
    path: string,
    init: RequestInitWithQuery = {}
  ): Promise<T> {
    const query = init.query ?? {};

    const url = new URL(path, this.baseUrl);

    if (query && Object.keys(query).length > 0) {
      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      ...init,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    console.log(response);

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return response.json() as T;
    }

    return response.text() as T;
  }

  public get<T = unknown>(path: string, init: RequestInitWithQuery) {
    return this.request<T>(path, {
      ...init,
      method: 'GET',
    });
  }

  public post<T = unknown>(path: string, init: RequestInitWithQuery) {
    return this.request<T>(path, {
      ...init,
      headers: {
        // 'Content-Type': 'application/json',
        ...init.headers,
      },
      method: 'POST',
    });
  }
}
