import { Logger, type OperationStats } from '@/logger';
import { NtfyClient } from './ntfy.client.ts';
import type {
  NtfyNotificationPayload,
  NtfyNotificationRequest,
} from './types.ts';

export class NtfyService {
  private ntfyClient: NtfyClient;
  private logger: Logger;

  private readonly topic = 'reddit-watcher-swapping-carnation5-stability';
  private readonly redditBaseUrls = [
    'https://www.reddit.com',
    'https://reddit.com',
  ];

  constructor(ntfyClient?: NtfyClient, logger?: Logger) {
    this.ntfyClient = ntfyClient ?? new NtfyClient();
    this.logger = logger ?? Logger.getInstance();
  }

  private getUrl(permalink: string) {
    const includesDomain = this.redditBaseUrls.some((url) =>
      permalink.includes(url)
    );

    return includesDomain ? permalink : `${this.redditBaseUrls[0]}${permalink}`;
  }

  public async sendCommentNotification({
    permalink,
    author,
  }: NtfyNotificationRequest): Promise<void> {
    const url = this.getUrl(permalink);

    this.logger.log(`username: ${author}, permalink: ${permalink}`);

    const message = `New or edited comment by ${author}`;

    const payload: NtfyNotificationPayload = {
      topic: this.topic,
      message,
      title: 'Check it out...',
      click: url,
      tags: ['speech_balloon'],
    };

    try {
      await this.ntfyClient.sendNotification(payload);
      this.logger.log(`Notification sent successfully for ${author}`);
    } catch (error) {
      this.logger.error(`Error sending notification for ${author}`, error);
    }
  }

  public async sendCommentNotifications(
    userComments: NtfyNotificationRequest[]
  ): Promise<OperationStats> {
    const results = await Promise.allSettled(
      userComments.map((comment) =>
        this.sendCommentNotification({
          permalink: comment.permalink,
          author: comment.author,
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

  public async sendErrorNotification(message: string): Promise<void> {
    const payload: NtfyNotificationPayload = {
      topic: this.topic,
      message,
      title: 'There was an error...',
      tags: ['warning'],
    };

    try {
      await this.ntfyClient.sendNotification(payload);
      this.logger.log(`Error notifications sent: ${message}`);
    } catch (error) {
      this.logger.error(`Failed to send error notification`, error);
    }
  }
}
