import type { HttpClient } from '@/http';
import type { Logger } from '@/logger';
import { assertEquals } from 'jsr:@std/assert';
import { assertSpyCalls, spy } from 'jsr:@std/testing/mock';
import { RedditClient } from './reddit.client.ts';
import type {
  RedditComment,
  RedditListing,
  RedditPost,
} from './types/reddit.ts';

// -- Mock Data --

const mockPostListing: RedditListing<RedditPost> = {
  kind: 'Listing',
  data: {
    after: null,
    before: null,
    children: [
      {
        kind: 't3',
        data: {
          id: '1',
          title: 'Test',
          permalink: '',
          author: '',
          subreddit: '',
          url: '',
          created_utc: 0,
        },
      },
    ],
  },
};

const mockCommentListing: RedditListing<RedditComment> = {
  kind: 'Listing',
  data: {
    after: null,
    before: null,
    children: [
      {
        kind: 't1',
        data: {
          id: '1',
          name: '',
          author: '',
          body: '',
          parent_id: '',
          link_id: '',
          link_title: '',
          created_utc: 0,
          link_author: '',
          link_permalink: '',
          link_url: '',
          subreddit: '',
          subreddit_id: '',
          subreddit_name_prefixed: '',
          edited: false,
          permalink: '',
        },
      },
    ],
  },
};

// -- Helpers --

class TestRedditClient extends RedditClient {
  constructor(httpClient: HttpClient, logger: Logger) {
    super(httpClient, logger);
  }
}

function mockHeaders(): Headers {
  return new Headers({ Authorization: 'Bearer token', 'User-Agent': 'test' });
}

function setupTestClient() {
  const get = spy((path: string, _options?: unknown) => {
    if (path.includes('/comments')) return Promise.resolve(mockCommentListing);
    if (path.includes('/search')) return Promise.resolve(mockPostListing);
    return Promise.resolve(mockPostListing);
  });

  const log = spy();
  const error = spy();

  const httpClient = { get } as unknown as HttpClient;
  const logger = { log, error } as unknown as Logger;

  const client = new TestRedditClient(httpClient, logger);
  client['tokenCache'] = null;
  client['createHeaders'] = () => Promise.resolve(mockHeaders());

  return { client, get, log, error };
}

// -- Tests --

Deno.test('searchPosts calls HttpClient.get with correct args', async () => {
  const { client, get } = setupTestClient();

  const result = await client.searchPosts('deno', 'foo');

  assertSpyCalls(get, 1);
  assertEquals(get.calls[0].args[0], '/r/deno/search');
  assertEquals(
    (get.calls[0].args[1] as { query: { q: string } })?.query?.q,
    'foo'
  );
  assertEquals(result, mockPostListing);
});

Deno.test(
  'getUserComments calls HttpClient.get with correct args',
  async () => {
    const { client, get } = setupTestClient();

    const result = await client.getUserComments('alice', 42);

    assertSpyCalls(get, 1);
    assertEquals(get.calls[0].args[0], '/user/alice/comments');
    assertEquals(
      (get.calls[0].args[1] as { query: { limit: number } }).query.limit,
      42
    );
    assertEquals(result, mockCommentListing);
  }
);

Deno.test(
  'getAccessToken uses cache and avoids duplicate fetches',
  async () => {
    const { client } = setupTestClient();
    let callCount = 0;

    client['fetchAccessToken'] = () => {
      callCount++;
      return Promise.resolve({
        access_token: 'abc',
        expires_in: 100,
        scope: '',
        token_type: '',
      });
    };

    const token1 = await client['getAccessToken']();
    const token2 = await client['getAccessToken']();

    assertEquals(token1, 'abc');
    assertEquals(token2, 'abc');
    assertEquals(callCount, 1);
  }
);

Deno.test('getAccessToken handles inflight token promise', async () => {
  const { client } = setupTestClient();

  let resolve: (val: {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  }) => void = () => {};

  client['fetchAccessToken'] = () =>
    new Promise((r) => {
      resolve = r;
    });

  const p1 = client['getAccessToken']();
  const p2 = client['getAccessToken']();

  resolve({ access_token: 'tok', expires_in: 100, scope: '', token_type: '' });

  const [t1, t2] = await Promise.all([p1, p2]);

  assertEquals(t1, 'tok');
  assertEquals(t2, 'tok');
});

Deno.test('fetchAccessToken logs and throws on error', async () => {
  const { client, error } = setupTestClient();

  client['fetchAccessToken'] = () => Promise.reject(new Error('fail'));

  await client['getAccessToken']().catch(() => {});

  assertSpyCalls(error, 1);
});
