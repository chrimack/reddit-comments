import { config } from '@/config';
import { NtfyService } from '@/ntfy';
import { RedditService } from '@/reddit';

const title = config.app.titles.mlb;

const post = await RedditService.getPostByTitle(title);

const comments = await RedditService.getPostComments(post.permalink);

comments.updated.forEach((comment) =>
  NtfyService.sendCommentNotification({
    permalink: comment.permalink,
    username: comment.author,
  })
);
