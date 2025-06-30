import { LeagueMetaMap } from './meta.ts';
import type { League } from './types.ts';

function getPostTitle(league: League): string {
  const { title } = LeagueMetaMap[league];
  return `${title} - ${getDateInfo()}`;
}

function getDateInfo(): string {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  return `${month}/${day}/${year} (${weekday})`;
}

export const LeagueUtils = { getPostTitle };
