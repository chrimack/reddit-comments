import { Leagues, type League } from '@/leagues';
import { NtfyService } from '@/ntfy';
import { RedditService } from '@/reddit';
import { Logger } from '@logger';

async function runForLeague(league: League) {
  try {
    const post = await RedditService.getPostByTitle(league);
    const comments = await RedditService.getPostComments(
      post.permalink,
      league
    );
    comments.updated.forEach((comment) =>
      NtfyService.sendCommentNotification({
        permalink: comment.permalink,
        username: comment.author,
      })
    );
  } catch (error) {
    Logger.error(`Failed to run watcher for league: ${league}`, error);
  }
}
// console.log(Leagues);
Leagues.forEach(runForLeague);
