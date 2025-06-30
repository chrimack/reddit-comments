export interface RedditPost {
  id: string;
  permalink: string;
  title: string;
  // (you can expand this as needed)
}

export interface RedditListing<T = RedditPost> {
  kind: 'Listing';
  data: {
    children: Array<{
      kind: 't3'; // t3 = post
      data: T;
    }>;
  };
}
