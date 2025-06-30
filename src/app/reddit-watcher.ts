import { Leagues, type League } from '@/leagues';
import { Logger } from '@/logger';
import { NtfyService } from '@/ntfy';
import { RedditService } from '@/reddit';

const MINUTES = 10;
const POLL_INTERVAL_MS = MINUTES * 60 * 1000;

const isRunning: Record<League, boolean> = {
  MLB: false,
  WNBA: false,
};

async function watchLeagueComments(league: League) {
  if (isRunning[league]) return;
  isRunning[league] = true;

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
  } finally {
    isRunning[league] = false;
  }
}

export function startRedditWatcher(): void {
  Logger.log(`Starting Reddit Watcher polling...`);

  Leagues.forEach((league) => {
    watchLeagueComments(league); // initial call
    setInterval(() => watchLeagueComments(league), POLL_INTERVAL_MS);
  });
}
