// import { NtfyService } from '@/ntfy';
import { Leagues, type League } from '@/leagues';
import { RedditService } from '@/reddit';

// comments.updated.forEach((comment) =>
//   NtfyService.sendCommentNotification({
//     permalink: comment.permalink,
//     username: comment.author,
//   })
// );

async function runForLeague(league: League) {
  const post = await RedditService.getPostByTitle(league);
  const _comments = await RedditService.getPostComments(post.permalink, league);
}

Leagues.forEach(runForLeague);
