import { Logger } from '@/logger';
import { NtfyClient } from './ntfy.client.ts';
import type { NtfyNotificationRequest } from './types.ts';

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

  const payload = {
    topic: TOPIC,
    message,
    title: 'Reddit Watcher',
    actions: [
      {
        action: 'view',
        label: 'View Comment',
        url,
        clear: true,
      },
    ],
  };

  try {
    await ntfyClient.sendNotification(payload);
    Logger.log(`Notification sent successfully for ${username}`);
  } catch (error) {
    Logger.error(`Error sending notification for ${username}`, error);
  }
}

export const NtfyService = { sendCommentNotification };
