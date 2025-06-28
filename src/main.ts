import { getAccessToken } from './auth/index.ts';
import { getPostByTitle, getPostComments } from './comments/index.ts';
import { config } from './config/index.ts';
import { mapToComment } from './utils/index.ts';

const token = await getAccessToken();
const usernames = config.app.users;

const subreddit = config.app.subreddit;
const title = config.app.titles.mlb;

const post = await getPostByTitle(subreddit, title, token);

const allComments = await getPostComments(post.permalink, token);

const userComments = allComments
  .filter((comment) => usernames.includes(comment.author))
  .map((comment) => mapToComment(comment));

console.log(JSON.stringify(userComments.slice(0, 2), null, 2));
