import type { Comment, RedditComment } from '../types/index.ts';

export function mapToComment(redditComment: RedditComment): Comment {
  return {
    id: redditComment.id,
    subredditId: redditComment.subreddit_id,
    subreddit: redditComment.subreddit,
    linkTitle: redditComment.link_title,
    postAuthor: redditComment.link_author,
    author: redditComment.author,
    parentId: redditComment.parent_id,
    body: redditComment.body,
    edited: redditComment.edited,
    permalink: redditComment.link_permalink,
    name: redditComment.name,
  };
}
