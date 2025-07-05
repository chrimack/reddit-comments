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

  /**
   * - `false`: The item has not been edited.
   * - `number`: The Unix timestamp of when the item was last edited (in seconds).
   */
  edited: boolean | number;

  /** Permalink to the comment */
  permalink: string;
  name: string;

  /** Optional field added to updated comments to show a preview of the changes */
  diffPreview?: string;
}

export interface UserCommentSyncResult {
  all: UserComment[];
  new: UserComment[];
  updated: UserComment[];
  stats: OperationStats;
}
