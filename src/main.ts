import { getAccessToken } from './auth/index.ts';
import { getPostByTitle, getPostComments } from './comments/index.ts';
import { config } from './config/index.ts';

const token = await getAccessToken();

const subreddit = config.app.subreddit;
const title = config.app.titles.mlb;

const post = await getPostByTitle(subreddit, title, token);

const comments = await getPostComments(post.permalink, token);

console.log(comments);
