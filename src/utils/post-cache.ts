import type { PostMeta } from '../types/index.ts';

const cacheFile = './post-cache.json';

type PostCache = Record<string, PostMeta>;

function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function loadPostCache(): PostCache {
  try {
    const data = Deno.readTextFileSync(cacheFile).trim();

    if (!data) {
      Deno.writeTextFileSync(cacheFile, '{}');
      return {};
    }

    return JSON.parse(data) as PostCache;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      Deno.writeTextFileSync(cacheFile, '{}');
      return {};
    }

    console.error('Error loading post cache:', error);
    return {};
  }
}

function savePostCache(cache: PostCache): void {
  try {
    const data = JSON.stringify(cache, null, 2);
    Deno.writeTextFileSync(cacheFile, data);
  } catch (error) {
    console.error('Error saving post cache:', error);
  }
}

export function getCachedPost(): PostMeta | null {
  const cache = loadPostCache();
  const key = getTodayKey();
  return cache[key] || null;
}

export function setCachedPost(post: PostMeta): void {
  const cache = loadPostCache();
  const key = getTodayKey();
  cache[key] = post;
  savePostCache(cache);
}
