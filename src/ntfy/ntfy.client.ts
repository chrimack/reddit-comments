import { HttpClient } from '@/http';
import type { NtfyNotificationPayload } from './types.ts';

export class NtfyClient {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient('https://ntfy.sh');
  }

  public async sendNotification(
    payload: NtfyNotificationPayload
  ): Promise<void> {
    const response = await this.client.post('', {
      body: JSON.stringify(payload),
    });

    console.log('Notification sent successfully:', response);
  }
}
