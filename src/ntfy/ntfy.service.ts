import { config } from '@/config';
import { Logger, type OperationStats } from '@/logger';
import type { UserComment } from '@/reddit/types';
import { NtfyClient } from './ntfy.client.ts';
import type {
  NtfyNotificationPayload,
  NtfyNotificationRequest,
} from './types.ts';

export class NtfyService {
  private readonly redditBaseUrls = [
    'https://www.reddit.com',
    'https://reddit.com',
  ];

  constructor(
    private ntfyClient = new NtfyClient(),
    private logger = Logger.getInstance(),
    private topic = config.app.ntfyTopic
  ) {}

  private getUrl(permalink: string) {
    const includesDomain = this.redditBaseUrls.some((url) =>
      permalink.includes(url)
    );

    return includesDomain ? permalink : `${this.redditBaseUrls[0]}${permalink}`;
  }

  private truncateBody(body: string, maxLength = 50) {
    if (body.length < maxLength) return body;
    return body.slice(0, maxLength - 3) + '...';
  }

  public async sendCommentNotification({
    permalink,
    author,
    message,
    title,
    tags,
  }: NtfyNotificationRequest): Promise<void> {
    const url = this.getUrl(permalink);

    this.logger.log(`username: ${author}, permalink: ${permalink}`);

    const payload: NtfyNotificationPayload = {
      topic: this.topic,
      message,
      title: title ?? 'Check it out...',
      click: url,
      tags,
      actions: [
        {
          action: 'view',
          label: 'View Comment',
          url,
          clear: false,
        },
      ],
    };

    try {
      await this.ntfyClient.sendNotification(payload);
      this.logger.log(`Notification sent successfully for ${author}`);
    } catch (error) {
      this.logger.error(`Error sending notification for ${author}`, error);
      throw error;
    }
  }

  public async sendCommentNotifications(
    newComments: UserComment[],
    updatedComments: UserComment[]
  ): Promise<OperationStats> {
    const newPromises = newComments.map((comment) =>
      this.sendCommentNotification({
        permalink: comment.permalink,
        author: comment.author,
        title: `${comment.author} just commented`,
        message: this.truncateBody(comment.body),
        tags: ['speech_balloon'],
      })
    );

    const updatedPromises = updatedComments.map((comment) => {
      this.sendCommentNotification({
        permalink: comment.permalink,
        author: comment.author,
        title: `${comment.author} edited a comment`,
        message: comment.diffPreview ?? this.truncateBody(comment.body),
        tags: ['pencil2'],
      });
    });

    const results = await Promise.allSettled([
      ...newPromises,
      ...updatedPromises,
    ]);

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
