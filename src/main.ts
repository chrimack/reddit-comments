import { getPostByTitle, getPostComments } from './comments/index.ts';
import { config } from './config/index.ts';

const subreddit = config.app.subreddit;
const title = config.app.titles.mlb;

const post = await getPostByTitle(subreddit, title);

const _comments = await getPostComments(post.permalink);

// console.log(comments);

// sendNotification(comments.all[0].permalink);
