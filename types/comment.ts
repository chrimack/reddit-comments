export interface Comment {
  id: string;
  subredditId: string;
  subreddit: string;

  /** Title of the post */
  linkTitle: string;

  /** Author of the post (not comment author) */
  postAuthor: string;

  /** Comment author */
  author: string;

  /** Id of parent comment */
  parentId: string;

  /** Comment text */
  body: string;

  /** Whether the comment has been edited */
  edited: boolean;

  /** Permalink to the comment */
  permalink: string;
  name: string;
}
