export interface RedditListing<T> {
  kind: 'Listing';
  data: {
    after: string | null;
    before: string | null;
    children: RedditChild<T>[];
    dist?: number;
    modhash?: string | null;
    geo_filter?: string;
  };
}

export interface RedditChild<T> {
  kind: string; // 't1' for comment, 't3' for post
  data: T;
}

export interface RedditPost {
  id: string;
  title: string;
  permalink: string;
  author: string;
  subreddit: string;
  url: string;
  selftext?: string;
  created_utc: number;
  num_comments?: number;
  ups?: number;
  downs?: number;
  score?: number;
}

export interface RedditComment {
  id: string;
  name: string;
  author: string;
  body: string;
  parent_id: string;
  link_id: string;
  link_title: string;
  link_author: string;
  link_permalink: string;
  link_url: string;

  subreddit: string;
  subreddit_id: string;
  subreddit_name_prefixed: string;

  created_utc: number;

  /**
   * - `false`: The item has not been edited.
   * - `number`: The Unix timestamp of when the item was last edited (in seconds).
   */
  edited: boolean | number;

  permalink: string;
}
