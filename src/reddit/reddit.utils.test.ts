import { config } from '@/config';
import type { RedditComment, RedditListing, UserComment } from '@/reddit/types';
import { assert, assertEquals } from 'jsr:@std/assert';
import { RedditMapper } from './reddit.mapper.ts';
import { RedditUtils } from './reddit.utils.ts';

// Mock config users to filter
config.app.users = ['alice', 'bob'];

// Minimal RedditComment factory
function createRedditComment(
  overrides: Partial<RedditComment> = {}
): RedditComment {
  return {
    id: 'abc123',
    author: 'alice',
    body: 'Hello world',
    edited: false,
    parent_id: 't3_postid',
    link_title: 'Some title',
    subreddit: 'sportsbook',
    name: '',
    link_id: '',
    link_author: '',
    link_permalink: '',
    link_url: '',
    subreddit_id: '',
    subreddit_name_prefixed: '',
    created_utc: 0,
    permalink: '',

    ...overrides,
  };
}

function createUserComment(
  id = 'abc123',
  edited: boolean | number = false,
  body = 'Hello world'
): UserComment {
  return {
    id,
    author: 'alice',
    body,
    edited,
    subredditId: '',
    subreddit: '',
    linkTitle: '',
    postAuthor: '',
    parentId: '',
    permalink: '',
    name: '',
  };
}

Deno.test('processRedditComments filters by config.app.users and maps', () => {
  const comments: RedditComment[] = [
    createRedditComment({ author: 'alice' }),
    createRedditComment({ author: 'charlie' }), // Not in config users, should be filtered out
    createRedditComment({ author: 'bob' }),
  ];

  // Spy on RedditMapper.fromRedditComment to check calls
  let mappedCount = 0;
  const originalMapper = RedditMapper.fromRedditComment;
  RedditMapper.fromRedditComment = (comment) => {
    mappedCount++;
    return {
      id: comment.id,
      author: comment.author,
      body: comment.body,
      edited: comment.edited,
      subredditId: '',
      subreddit: '',
      linkTitle: '',
      postAuthor: '',
      parentId: '',
      permalink: '',
      name: '',
    };
  };

  const result = RedditUtils.processRedditComments(comments);

  assertEquals(result.length, 2);
  assertEquals(result[0].author, 'alice');
  assertEquals(result[1].author, 'bob');
  assertEquals(mappedCount, 2);

  // Restore original
  RedditMapper.fromRedditComment = originalMapper;
});

Deno.test(
  'getNewAndUpdatedComments detects new, edited, and body changes',
  () => {
    const cachedMap = new Map<string, UserComment>([
      ['1', createUserComment('1', false, 'old body')],
      ['2', createUserComment('2', false, 'unchanged')],
      ['3', createUserComment('3', 1720000000, 'already edited')], // was edited before
    ]);

    const current: UserComment[] = [
      createUserComment('1', false, 'new body'), // same edited, body changed — now ignored
      createUserComment('2', 1720000000, 'unchanged'), // was unedited, now edited (number) — updated
      createUserComment('3', 1720000100, 'already edited'), // newer edit timestamp — updated
      createUserComment('4', false, 'brand new'), // new comment — new
      createUserComment('5', 1720000200, 'new edit'), // new comment with timestamped edit — new
    ];

    const result = RedditUtils.getNewAndUpdatedComments(cachedMap, current);

    const newIds = result.new.map((c) => c.id);
    const updatedIds = result.updated.map((c) => c.id);

    console.log('new:', newIds);
    console.log('updated:', updatedIds);

    // New comments
    assert(newIds.includes('4')); // new and unedited
    assert(newIds.includes('5')); // new with edited timestamp

    // Updated comments
    assert(updatedIds.includes('2')); // went from unedited → edited
    assert(updatedIds.includes('3')); // edited timestamp increased

    // Should NOT include:
    assert(!updatedIds.includes('1')); // same edited, body change is now ignored
    assert(!newIds.includes('1'));
    assert(!updatedIds.includes('4'));
    assert(!updatedIds.includes('5'));
  }
);

Deno.test('getTodayTopLevelComments filters correctly', () => {
  const dateInfo = RedditUtils.getDateInfo();
  // Construct listing with various children
  const listing: RedditListing<RedditComment> = {
    kind: 'Listing',
    data: {
      after: null,
      before: null,
      children: [
        {
          kind: 't1',
          data: createRedditComment({
            subreddit: 'sportsbook',
            link_title: `Betting tips ${dateInfo}`,
            parent_id: 't3_post1', // top-level
          }),
        },
        {
          kind: 't1',
          data: createRedditComment({
            subreddit: 'sportsbook',
            link_title: `Betting tips ${dateInfo}`,
            parent_id: 't1_comment1', // not top-level
          }),
        },
        {
          kind: 't1',
          data: createRedditComment({
            subreddit: 'othersubreddit',
            link_title: `Betting tips ${dateInfo}`,
            parent_id: 't3_post2',
          }),
        },
        {
          kind: 't1',
          data: createRedditComment({
            subreddit: 'sportsbook',
            link_title: 'Old post title',
            parent_id: 't3_post3',
          }),
        },
      ],
    },
  };

  // Spy on RedditMapper.fromRedditComment
  let mappedCount = 0;
  const originalMapper = RedditMapper.fromRedditComment;
  RedditMapper.fromRedditComment = (comment) => {
    mappedCount++;
    return {
      id: comment.id,
      author: comment.author,
      body: comment.body,
      edited: comment.edited,
      subredditId: '',
      subreddit: comment.subreddit,
      linkTitle: '',
      postAuthor: '',
      parentId: comment.parent_id,
      permalink: '',
      name: '',
    };
  };

  const result = RedditUtils.getTodayTopLevelComments(listing, 'sportsbook');

  assertEquals(result.userComments.length, 1);
  assertEquals(mappedCount, 1);
  assertEquals(result.userComments[0].parentId.startsWith('t3'), true);
  assertEquals(result.userComments[0].subreddit, 'sportsbook');

  // Restore
  RedditMapper.fromRedditComment = originalMapper;
});
