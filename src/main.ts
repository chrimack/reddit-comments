import { config } from '@/config';
import { RedditService } from '@/reddit';

const subreddit = config.app.subreddit;
const title = config.app.titles.mlb;

const post = await RedditService.getPostByTitle(subreddit, title);

const _comments = await RedditService.getPostComments(post.permalink);

// console.log(comments);

// sendNotification(comments.all[0].permalink);
