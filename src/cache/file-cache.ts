import { dirname } from 'https://deno.land/std/path/mod.ts';

function getTodayKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function ensureDirForFile(filePath: string): void {
  const dir = dirname(filePath);
  try {
    Deno.mkdirSync(dir, { recursive: true });
  } catch (err) {
    if (!(err instanceof Deno.errors.AlreadyExists)) {
      console.error(`Failed to create cache directory ${dir}:`, err);
    }
  }
}

function loadCache<T>(filePath: string): Record<string, T> {
  try {
    const data = Deno.readTextFileSync(filePath).trim();

    if (!data) {
      ensureDirForFile(filePath);
      Deno.writeTextFileSync(filePath, '{}');
      return {};
    }

    return JSON.parse(data) as Record<string, T>;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      ensureDirForFile(filePath);
      Deno.writeTextFileSync(filePath, '{}');
      return {};
    }

    console.error('Error loading post cache:', error);
    return {};
  }
}

function saveCache<T>(filePath: string, cache: Record<string, T>): void {
  try {
    const data = JSON.stringify(cache, null, 2);
    Deno.writeTextFileSync(filePath, data);
  } catch (error) {
    console.error('Error saving cache:', filePath, error);
  }
}

function get<T>(filePath: string): T | null {
  const cache = loadCache<T>(filePath);
  const key = getTodayKey();
  return cache[key] ?? null;
}

function set<T>(filePath: string, value: T): void {
  const cache = loadCache<T>(filePath);
  const key = getTodayKey();
  cache[key] = value;
  saveCache(filePath, cache);
}

export const FileCache = {
  get,
  set,
};
