import type { OperationStats } from '@/logger';

export interface UserComment {
  id: string;
  subredditId: string;
  subreddit: string;

  /**
   * TODO: This is undefined when getting the comments from the post instead of the user.
   * Title of the post */
  linkTitle: string;

  /**
   * TODO: This is undefined when getting the comments from the post instead of the user.
   * Author of the post (not comment author) */
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

export interface UserCommentSyncResult {
  all: UserComment[];
  new: UserComment[];
  updated: UserComment[];
  stats: OperationStats;
}
