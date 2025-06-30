const TOPIC = 'reddit-watcher-swapping-carnation5-stability';
const BASE_URL = 'https://ntfy.sh';
const redditBaseUrl = 'https://reddit.com';
export async function sendNotification(permalink: string): Promise<void> {
  const url = `${redditBaseUrl}${permalink}`;
  const payload = {
    topic: TOPIC,
    message: 'tap to open in reddit',
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
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Failed to send notification:', response.statusText);
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }

    console.log('Notification sent successfully:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
