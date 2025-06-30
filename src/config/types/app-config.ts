export interface AppConfig {
  /** Users to watch */
  users: string[];

  /** Subreddit to search */
  subreddit: string;

  /** Post titles */
  titles: {
    mlb: string;
    wnba: string;
  };
}
