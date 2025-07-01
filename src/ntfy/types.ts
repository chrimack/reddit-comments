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

export interface NtfyNotificationRequest {
  permalink: string;
  username: string;
}
