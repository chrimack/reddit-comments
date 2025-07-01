import { Logger } from '@/logger';
import { FileUtils } from './file.utils.ts';

const lockFilePath = './cache/.cleanup.lock';
let lastCleanUpDay: string | null = null;

const getDateStamp = () => new Date().toISOString().split('T')[0];

function shouldRunCleanup() {
  const today = getDateStamp();

  if (lastCleanUpDay === today) return false;

  try {
    if (!FileUtils.fileExists(lockFilePath)) {
      FileUtils.initEmptyFile(lockFilePath);
    }

    const lastRun = Deno.readTextFileSync(lockFilePath).trim();

    if (lastRun === today) {
      lastCleanUpDay = today;
      return false;
    }
  } catch (error) {
    Logger.warn(`Could not read cleanup lock file: ${lockFilePath}`, error);
  }

  lastCleanUpDay = today;
  return true;
}

function markCleanupRan(): void {
  const today = getDateStamp();
  FileUtils.ensureDirForFile(lockFilePath);
  Deno.writeTextFileSync(lockFilePath, today);
}

export const Cleanup = {
  markCleanupRan,
  shouldRunCleanup,
};
