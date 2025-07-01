import { Logger } from '@/logger';
import { FileUtils } from './file.utils.ts';

function cleanup<T>(filePath: string) {
  const todayKey = getCacheKey();

  try {
    const cache = loadCache<T>(filePath);

    for (const key of Object.keys(cache)) {
      if (key !== todayKey) {
        delete cache[key];
      }
    }

    saveCache(filePath, cache);
    Logger.log(`Cleaned up ${filePath}, kept: ${todayKey}`);
  } catch (error) {
    Logger.warn(`Failed to clean up ${filePath}`, error);
  }
}

function getCacheKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const key = `${y}-${m}-${d}`;
  return key;
}

function loadCache<T>(filePath: string): Record<string, T> {
  try {
    const data = Deno.readTextFileSync(filePath).trim();

    if (!data) {
      FileUtils.initEmptyFile(filePath);
      return {};
    }

    return JSON.parse(data) as Record<string, T>;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      FileUtils.initEmptyFile(filePath);
      return {};
    }

    Logger.error('Error loading cache:', error);
    return {};
  }
}

function saveCache<T>(filePath: string, cache: Record<string, T>): void {
  try {
    const data = JSON.stringify(cache, null, 2);
    Deno.writeTextFileSync(filePath, data);
  } catch (error) {
    Logger.error('Error saving cache:', filePath, error);
  }
}

function get<T>(filePath: string): T | null {
  const cache = loadCache<T>(filePath);
  const key = getCacheKey();
  return cache[key] ?? null;
}

function set<T>(filePath: string, value: T): void {
  const cache = loadCache<T>(filePath);
  const key = getCacheKey();
  cache[key] = value;
  saveCache(filePath, cache);
}

export const FileCache = {
  cleanup,
  get,
  set,
};
