import { load } from 'https://deno.land/std@0.224.0/dotenv/mod.ts';

const env = await load();

export const config = {
  clientId: env.CLIENT_ID,
  clientSecret: env.CLIENT_SECRET,
  password: env.PASSWORD,
  username: env.USERNAME,
  userAgent: `personal-script:comment-watcher:v1.0.0 (by /u/${env.USERNAME})`,
};
