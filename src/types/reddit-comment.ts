export interface RedditComment {
  subreddit_id: string;
  link_title: string;
  subreddit: string;
  link_author: string;
  id: string;
  author: string;
  parent_id: string;
  body: string;
  edited: boolean;
  link_permalink: string;
  name: string;
  subreddit_name_prefixed: string;
  created_utc: number;
  link_url: string;
}

export interface RedditCommentChild {
  kind: string;
  data: RedditComment;
}

export interface RedditCommentResponseData {
  after: string | null;
  dist: number;
  modhash: string | null;
  geo_filter: string;
  children: RedditCommentChild[];
  before: string | null;
}

export interface RedditCommentResponse {
  kind: string;
  data: RedditCommentResponseData;
}
