import { Logger } from '@/logger';
import { DateUtils } from '@/utils';
import { FileUtils } from './file.utils.ts';

export class CleanupManager {
  private logger: Logger;
  private lastCleanUpDay: string | null = null;

  constructor(private lockFilePath = './cache/.cleanup.lock', logger?: Logger) {
    this.logger = logger ?? Logger.getInstance();
  }

  public shouldRunCleanup() {
    const today = DateUtils.getTodayDateString();

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
      this.logger.warn(
        `Could not read cleanup lock file: ${this.lockFilePath}`,
        error
      );
    }

    this.lastCleanUpDay = today;
    return true;
  }

  public markCleanupRan(): void {
    const today = DateUtils.getTodayDateString();
    FileUtils.ensureDirForFile(this.lockFilePath);
    Deno.writeTextFileSync(this.lockFilePath, today);
  }
}
