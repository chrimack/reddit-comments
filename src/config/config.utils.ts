import type { League } from './types/leagues.ts';

function getPostTitle(league: League): string {
  const dateInfo = getDateInfo();
  return `${leagueTitles[league]} - ${dateInfo}`;
}

function getDateInfo(): string {
  // return example '6/27/25 (Friday)'
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2); // last two digits of the year
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  return `${month}/${day}/${year} (${weekday})`;
}

const leagueTitles: Record<League, string> = {
  MLB: 'MLB Betting and Picks',
  WNBA: 'WNBA Picks and Odds',
};

export const ConfigUtils = { getPostTitle };
