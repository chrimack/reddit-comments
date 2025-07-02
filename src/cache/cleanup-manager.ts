import { Logger } from '@/logger';
import { FileUtils } from './file.utils.ts';

export class CleanupManager {
  private lastCleanUpDay: string | null = null;
  constructor(private lockFilePath = './cache/.cleanup.lock') {}

  private getDateStamp() {
    return new Date().toISOString().split('T')[0];
  }

  public shouldRunCleanup() {
    const today = this.getDateStamp();

    if (this.lastCleanUpDay === today) return false;

    try {
      if (!FileUtils.fileExists(this.lockFilePath)) {
        FileUtils.initEmptyFile(this.lockFilePath);
      }

      const lastRun = Deno.readTextFileSync(this.lockFilePath).trim();

      if (lastRun === today) {
        this.lastCleanUpDay = today;
        return false;
      }
    } catch (error) {
      Logger.warn(
        `Could not read cleanup lock file: ${this.lockFilePath}`,
        error
      );
    }

    this.lastCleanUpDay = today;
    return true;
  }

  public markCleanupRan(): void {
    const today = this.getDateStamp();
    FileUtils.ensureDirForFile(this.lockFilePath);
    Deno.writeTextFileSync(this.lockFilePath, today);
  }
}
