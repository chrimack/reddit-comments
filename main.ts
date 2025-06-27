import { getAccessToken } from './auth/index.ts';
import { getUserComments } from './comments/index.ts';
import { mapToComment } from './utils/index.ts';

const token = await getAccessToken();
const username = 'e77754321';
const redditComments = await getUserComments(username, token);
const comments = redditComments.map((redditComment) =>
  mapToComment(redditComment)
);
console.log(comments);
