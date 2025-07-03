import type { UserComment } from '@/reddit/types';

interface NtfyAction {
  action: string;
  label: string;
  url: string;
  clear?: boolean;
}

export interface NtfyNotificationPayload {
  topic: string;
  message: string;
  title?: string;
  priority?: number;
  tags?: string[];
  actions?: NtfyAction[];
  click?: string;
}

export type NtfyNotificationRequest = Pick<UserComment, 'author' | 'permalink'>;
