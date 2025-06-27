import { getAccessToken } from './auth/index.ts';
import { getPostByTitle, getPostComments } from './comments/index.ts';

const token = await getAccessToken();
const username = 'e77754321';

const subreddit = 'sportsbook';
const title = 'MLB Betting and Picks - 6/27/25 (Friday)';
const post = await getPostByTitle(subreddit, title, token);

const allComments = await getPostComments(post.permalink, token);

const userComments = allComments.filter(
  (comment) => comment.author === username
);

console.log(JSON.stringify(userComments.slice(0, 2), null, 2));
