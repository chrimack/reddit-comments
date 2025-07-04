import { HttpClient } from '@/http';
import { Logger } from '@/logger';
import type { NtfyNotificationPayload } from './types.ts';

export class NtfyClient {
  constructor(
    private client = new HttpClient('https://ntfy.sh'),
    private logger = Logger.getInstance()
  ) {}

  public async sendNotification(
    payload: NtfyNotificationPayload
  ): Promise<void> {
    try {
      await this.client.post('', {
        body: JSON.stringify(payload),
      });
    } catch (error) {
      this.logger.error(`Error sending notification`, error);
      throw error;
    }
  }
}
