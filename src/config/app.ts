import { env } from './env.ts';
import type { AppConfig } from './types/app-config.ts';

export const appConfig: AppConfig = {
  ntfyTopic: env.NTFY_TOPIC,
  users: [
    'abetterbettor',
    'e77754321',
    'IrresponsibleBetting',
    'PropsPulse',
    'quarterkelly',
    'Romans828Believer',
    'Skipperdees_ears',
    'UnusualBad5037',
    'PurpleDragonBets',
    'FlawdaBoiJo',
    'BreakfastAtWimbledon',
    'BellesPicks',
    'Timely-Conclusion532',
  ],
  subreddit: 'sportsbook',
  timeWindow: {
    startHour: 6,
    endHour: 22,
  },
  timeZone: 'America/New_York',
};
