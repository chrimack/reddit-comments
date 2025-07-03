import type { Logger } from '@/logger';
import type { UserComment } from '@/reddit/types';
import { assertEquals } from 'jsr:@std/assert';
import { assertSpyCalls, spy } from 'jsr:@std/testing/mock';
import type { NtfyClient } from './ntfy.client.ts';
import { NtfyService } from './ntfy.service.ts';
import type { NtfyNotificationPayload } from './types.ts';

function createMocks() {
  const sendNotification = spy(() => Promise.resolve());
  const log = spy();
  const error = spy();
  const mockNtfyClient = { sendNotification } as unknown as NtfyClient;
  const mockLogger = { log, error } as unknown as Logger;
  return { mockNtfyClient, mockLogger, sendNotification, log, error };
}

Deno.test('sendCommentNotification calls ntfyClient and logs', async () => {
  const { mockNtfyClient, mockLogger, sendNotification, log } = createMocks();
  const service = new NtfyService(mockNtfyClient, mockLogger);
  await service.sendCommentNotification({
    permalink: '/r/test/abc',
    author: 'bob',
    message: 'bob just commented',
  });
  assertSpyCalls(sendNotification, 1);
  assertSpyCalls(log, 2); // logs before and after
});

Deno.test('sendCommentNotification logs error on failure', async () => {
  const { mockNtfyClient, mockLogger, error } = createMocks();
  mockNtfyClient.sendNotification = () => Promise.reject(new Error('fail'));

  const service = new NtfyService(mockNtfyClient, mockLogger);

  try {
    await service.sendCommentNotification({
      permalink: '/r/test/abc',
      author: 'bob',
      message: 'bob just commented',
    });
  } catch {
    // intentionally ignored, we only care that error was logged
  }

  assertSpyCalls(error, 1);
});

Deno.test('sendCommentNotifications returns correct stats', async () => {
  const { mockNtfyClient, mockLogger } = createMocks();
  // Fail the second notification
  mockNtfyClient.sendNotification = spy((_payload: NtfyNotificationPayload) => {
    // the author property is added to the message in the payload
    if (_payload.message.includes('fail'))
      return Promise.reject(new Error('fail'));
    return Promise.resolve();
  });
  const service = new NtfyService(mockNtfyClient, mockLogger);
  const newComments = [
    { permalink: '/r/test/1', author: 'ok1', body: '', edited: false, id: 'a' },
    {
      permalink: '/r/test/2',
      author: 'fail',
      body: '',
      edited: false,
      id: 'b',
    },
  ] as UserComment[];

  const updatedComments = [
    { permalink: '/r/test/3', author: 'ok2', body: '', edited: true, id: 'c' },
  ] as UserComment[];

  const stats = await service.sendCommentNotifications(
    newComments,
    updatedComments
  );
  assertEquals(stats, { success: 2, failed: 1 });
});

Deno.test('sendErrorNotification calls ntfyClient and logs', async () => {
  const { mockNtfyClient, mockLogger, sendNotification, log } = createMocks();
  const service = new NtfyService(mockNtfyClient, mockLogger);
  await service.sendErrorNotification('something went wrong');
  assertSpyCalls(sendNotification, 1);
  assertSpyCalls(log, 1);
});

Deno.test('sendErrorNotification logs error on failure', async () => {
  const { mockNtfyClient, mockLogger, error } = createMocks();
  mockNtfyClient.sendNotification = () => Promise.reject(new Error('fail'));
  const service = new NtfyService(mockNtfyClient, mockLogger);
  await service.sendErrorNotification('fail');
  assertSpyCalls(error, 1);
});
