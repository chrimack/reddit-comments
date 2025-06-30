import { NtfyClient } from './ntfy.client.ts';
import type { NtfyNotificationRequest } from './types.ts';

const TOPIC = 'reddit-watcher-swapping-carnation5-stability';
const REDDIT_BASE_URL = 'https://reddit.com';

const ntfyClient = new NtfyClient();

async function sendCommentNotification({
  permalink,
  username,
}: NtfyNotificationRequest): Promise<void> {
  const url = `${REDDIT_BASE_URL}${permalink}`;
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
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

export const NtfyService = { sendCommentNotification };
