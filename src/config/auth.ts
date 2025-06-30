import { env } from './env.ts';
import type { AuthConfig } from './types/auth-config.ts';

export const authConfig: AuthConfig = {
  clientId: env.CLIENT_ID,
  clientSecret: env.CLIENT_SECRET,
  password: env.PASSWORD,
  username: env.USERNAME,
};
