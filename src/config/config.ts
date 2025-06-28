import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';
import { getPostTitle } from '../utils/index.ts';

const env = await load();

const auth = {
  clientId: env.CLIENT_ID,
  clientSecret: env.CLIENT_SECRET,
  password: env.PASSWORD,
  username: env.USERNAME,
};

const app = {
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
    mlb: getPostTitle('MLB'),
  },
};

const cache = {
  posts: './cache/posts.json',
  comments: './cache/comments.json',
};

export const config = {
  auth,
  app,
  cache,
  userAgent: `personal-script:comment-watcher:v1.0.0 (by /u/${env.USERNAME})`,
};
