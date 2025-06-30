import type { League, LeagueMeta } from './types.ts';

export const LeagueMetaMap: Record<League, LeagueMeta> = {
  MLB: {
    key: 'MLB',
    title: 'MLB Betting and Picks',
    subreddit: 'sportsbook',
  },
  WNBA: {
    key: 'WNBA',
    title: 'WNBA Picks and Odds',
    subreddit: 'sportsbook',
  },
};

export const Leagues = Object.keys(LeagueMetaMap) as ReadonlyArray<League>;
