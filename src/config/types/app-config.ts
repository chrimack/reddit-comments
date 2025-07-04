export interface AppConfig {
  /** Topic used to subscribe to Ntfy alerts */
  ntfyTopic: string;

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
