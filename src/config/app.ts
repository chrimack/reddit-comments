import { ConfigUtils } from './config.utils.ts';
import type { AppConfig } from './types/app-config.ts';

export const appConfig: AppConfig = {
  users: [
    'abetterbettor',
    'e77754321',
    'IrresponsibleBetting',
    'PropsPulse',
    'quarterkelly',
    'Romans828Believer',
    'Skipperdees_ears',
    'UnusualBad5037',
  ],
  subreddit: 'sportsbook',
  titles: {
    mlb: ConfigUtils.getPostTitle('MLB'),
    wnba: ConfigUtils.getPostTitle('WNBA'),
  },
};
