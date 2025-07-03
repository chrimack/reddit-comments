import { Logger } from '@/logger';
import { DateUtils } from '@/utils';
import { FileUtils } from './file.utils.ts';

export class CacheManager<T = unknown> {
  private logger = Logger.getInstance();

  constructor(private filePath: string) {}

  private getCacheKey(date = new Date()): string {
    return DateUtils.formatDate(date);
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
      this.logger.error('Error loading cache:', error);
      return {};
    }
  }

  private saveCache(cache: Record<string, T>): void {
    try {
      const data = JSON.stringify(cache, null, 2);
      Deno.writeTextFileSync(this.filePath, data);
    } catch (error) {
      this.logger.error('Error saving cache:', this.filePath, error);
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
      this.logger.log(`Cleaned up ${this.filePath}, kept: ${todayKey}`);
    } catch (error) {
      this.logger.warn(`Failed to clean up ${this.filePath}`, error);
    }
  }
}
