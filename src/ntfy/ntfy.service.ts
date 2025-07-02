import { Logger, type OperationStats } from '@/logger';
import type { UserComment } from '@/reddit/types';
import { NtfyClient } from './ntfy.client.ts';
import type {
  NtfyNotificationPayload,
  NtfyNotificationRequest,
} from './types.ts';

const TOPIC = 'reddit-watcher-swapping-carnation5-stability';
const REDDIT_BASE_URLS = ['https://www.reddit.com', 'https://reddit.com'];

const ntfyClient = new NtfyClient();

function getUrl(permalink: string) {
  const includesDomain = REDDIT_BASE_URLS.some((url) =>
    permalink.includes(url)
  );

  return includesDomain ? permalink : `${REDDIT_BASE_URLS[0]}${permalink}`;
}

async function sendCommentNotification({
  permalink,
  username,
}: NtfyNotificationRequest): Promise<void> {
  const url = getUrl(permalink);

  Logger.log(`username: ${username}, permalink: ${permalink}`);

  const message = `New or edited comment by ${username}`;

  const payload: NtfyNotificationPayload = {
    topic: TOPIC,
    message,
    title: 'Check it out...',
    click: url,
    tags: ['speech_balloon'],
  };

  try {
    await ntfyClient.sendNotification(payload);
    Logger.log(`Notification sent successfully for ${username}`);
  } catch (error) {
    Logger.error(`Error sending notification for ${username}`, error);
  }
}

async function sendNotifications(
  userComments: UserComment[]
): Promise<OperationStats> {
  const results = await Promise.allSettled(
    userComments.map((comment) =>
      NtfyService.sendCommentNotification({
        permalink: comment.permalink,
        username: comment.author,
      })
    )
  );

  return results.reduce(
    (acc, result) => {
      result.status === 'fulfilled' ? acc.success++ : acc.failed++;
      return acc;
    },
    { success: 0, failed: 0 }
  );
}

async function sendErrorNotification(message: string) {
  const payload: NtfyNotificationPayload = {
    topic: TOPIC,
    message,
    title: 'There was an error...',
    tags: ['warning'],
  };

  try {
    await ntfyClient.sendNotification(payload);
    Logger.log(`Error notifications sent: ${message}`);
  } catch (error) {
    Logger.error(`Failed to send error notification`, error);
  }
}

export const NtfyService = {
  sendCommentNotification,
  sendErrorNotification,
  sendNotifications,
};
