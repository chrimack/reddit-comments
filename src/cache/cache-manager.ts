import { Logger } from '@/logger';
import { FileUtils } from './file.utils.ts';

export class CacheManager<T = unknown> {
  constructor(private filePath: string) {}

  private getCacheKey(date = new Date()): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private loadCache(): Record<string, T> {
    try {
      const data = Deno.readTextFileSync(this.filePath).trim();
      if (!data) {
        FileUtils.initEmptyFile(this.filePath);
        return {};
      }
      return JSON.parse(data) as Record<string, T>;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        FileUtils.initEmptyFile(this.filePath);
        return {};
      }
      Logger.error('Error loading cache:', error);
      return {};
    }
  }

  private saveCache(cache: Record<string, T>): void {
    try {
      const data = JSON.stringify(cache, null, 2);
      Deno.writeTextFileSync(this.filePath, data);
    } catch (error) {
      Logger.error('Error saving cache:', this.filePath, error);
    }
  }

  get(date = new Date()): T | null {
    const cache = this.loadCache();
    const key = this.getCacheKey(date);
    return cache[key] ?? null;
  }

  set(value: T, date = new Date()): void {
    const cache = this.loadCache();
    const key = this.getCacheKey(date);
    cache[key] = value;
    this.saveCache(cache);
  }

  cleanup(): void {
    const todayKey = this.getCacheKey();
    try {
      const cache = this.loadCache();
      for (const key of Object.keys(cache)) {
        if (key !== todayKey) {
          delete cache[key];
        }
      }
      this.saveCache(cache);
      Logger.log(`Cleaned up ${this.filePath}, kept: ${todayKey}`);
    } catch (error) {
      Logger.warn(`Failed to clean up ${this.filePath}`, error);
    }
  }
}
