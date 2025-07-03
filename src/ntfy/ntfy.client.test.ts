import type { HttpClient } from '@/http';
import type { Logger } from '@/logger';
import { assertEquals, assertRejects } from 'jsr:@std/assert';
import { NtfyClient } from './ntfy.client.ts';

Deno.test(
  'NtfyClient.sendNotification calls HttpClient.post with payload',
  async () => {
    let called = false;
    let receivedPayload = null;
    const mockHttpClient = {
      post: (_path: string, init: { body: string }) => {
        called = true;
        receivedPayload = JSON.parse(init.body);
        return Promise.resolve();
      },
    };
    const client = new NtfyClient(mockHttpClient as HttpClient);
    const payload = { topic: 'Test', message: 'Hello' };
    await client.sendNotification(payload);
    assertEquals(called, true);
    assertEquals(receivedPayload, payload);
  }
);

Deno.test('NtfyClient.sendNotification logs and throws on error', async () => {
  const error = new Error('fail');
  const mockHttpClient = {
    post: () => Promise.reject(error),
  } as unknown as HttpClient;
  let logged = false;
  const mockLogger = {
    error: (msg: string, err: unknown) => {
      logged = true;
      assertEquals(msg.includes('Error sending notification'), true);
      assertEquals(err, error);
    },
  } as Logger;
  const client = new NtfyClient(mockHttpClient, mockLogger);
  await assertRejects(
    () => client.sendNotification({ topic: 'Test', message: 'Hello' }),
    Error,
    'fail'
  );
  assertEquals(logged, true);
});
