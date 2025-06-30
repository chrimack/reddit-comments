import { Logger } from '@logger';
import { appConfig } from './app.ts';
import { authConfig } from './auth.ts';
import { cacheConfig } from './cache.ts';
import { env } from './env.ts';

export const config = {
  auth: authConfig,
  app: appConfig,
  cache: cacheConfig,
  userAgent: `personal-script:comment-watcher:v1.0.0 (by /u/${env.USERNAME})`,
};

Logger.log('Loaded config: ', config);
