import { Leagues, type League } from '@/leagues';
import { NtfyService } from '@/ntfy';
import { RedditService } from '@/reddit';

async function runForLeague(league: League) {
  const post = await RedditService.getPostByTitle(league);
  const comments = await RedditService.getPostComments(post.permalink, league);
  comments.updated.forEach((comment) =>
    NtfyService.sendCommentNotification({
      permalink: comment.permalink,
      username: comment.author,
    })
  );
}
console.log(Leagues);
// Leagues.forEach(runForLeague);
