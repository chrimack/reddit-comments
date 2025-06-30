import type { RedditComment, UserComment } from '@reddit/types';

function fromRedditComment(redditComment: RedditComment): UserComment {
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
    permalink: redditComment.link_permalink ?? redditComment.permalink,
    name: redditComment.name,
  };
}

export const RedditMapper = {
  fromRedditComment,
};
