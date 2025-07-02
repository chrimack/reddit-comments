import { assertEquals } from 'jsr:@std/assert';
import { CacheManager } from './cache-manager.ts';

const TEST_CACHE_FILE = './cache/test-cache.json';

function cleanupTestFile() {
  try {
    Deno.removeSync(TEST_CACHE_FILE);
  } catch {
    // ignore
  }
}

Deno.test('set and get cache value for today', () => {
  cleanupTestFile();
  const cache = new CacheManager<number>(TEST_CACHE_FILE);
  cache.set(42);
  assertEquals(cache.get(), 42);
  cleanupTestFile();
});

Deno.test('get returns null if no value for today', () => {
  cleanupTestFile();
  const cache = new CacheManager<number>(TEST_CACHE_FILE);
  assertEquals(cache.get(), null);
  cleanupTestFile();
});

Deno.test('cleanup removes old keys and keeps today', () => {
  cleanupTestFile();
  const cache = new CacheManager<number>(TEST_CACHE_FILE);
  // Set yesterday and today
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  cache.set(1, yesterday);
  cache.set(2, today);
  cache.cleanup();
  const loaded = JSON.parse(Deno.readTextFileSync(TEST_CACHE_FILE));
  assertEquals(Object.keys(loaded).length, 1);
  const todayKey = cache['getCacheKey'](today);
  assertEquals(loaded[todayKey], 2);
  cleanupTestFile();
});
