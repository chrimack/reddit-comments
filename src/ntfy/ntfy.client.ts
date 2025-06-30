import { HttpClient } from '@/http';
import { Logger } from '@/logger';
import type { NtfyNotificationPayload } from './types.ts';

export class NtfyClient {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient('https://ntfy.sh');
  }

  public async sendNotification(
    payload: NtfyNotificationPayload
  ): Promise<void> {
    try {
      await this.client.post('', {
        body: JSON.stringify(payload),
      });
    } catch (error) {
      Logger.error(`Error sending notification`, error);
      throw error;
    }
  }
}
