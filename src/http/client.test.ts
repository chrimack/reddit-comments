import { assertEquals, assertRejects } from 'jsr:@std/assert';
import { HttpClient } from './client.ts';

// Save the original fetch to restore later
const originalFetch = globalThis.fetch;

Deno.test('HttpClient.get returns JSON', async () => {
  globalThis.fetch = (_input, _init) =>
    Promise.resolve(
      new Response(JSON.stringify({ foo: 'bar' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

  const client = new HttpClient('https://api.example.com/');
  const result = await client.get<{ foo: string }>('/test', {});
  assertEquals(result, { foo: 'bar' });

  globalThis.fetch = originalFetch;
});

Deno.test('HttpClient.get throws on error', async () => {
  globalThis.fetch = (_input, _init) =>
    Promise.resolve(new Response('Not found', { status: 404 }));

  const client = new HttpClient('https://api.example.com/');
  await assertRejects(
    () => client.get('/fail', {}),
    Error,
    'HTTP error! status: 404'
  );

  globalThis.fetch = originalFetch;
});
