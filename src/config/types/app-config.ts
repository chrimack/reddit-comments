export interface AppConfig {
  /** Users to watch */
  users: string[];

  /** Subreddit to search */
  subreddit: string;

  /**
   * Defines the local time window (in 24-hour format)
   * during which the app is allowed to run
   * */
  timeWindow: {
    startHour: number;
    endHour: number;
  };
  timeZone: string;
}
