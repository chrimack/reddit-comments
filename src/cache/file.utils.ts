import { Logger } from '@/logger';
import { dirname } from 'https://deno.land/std/path/mod.ts';

function ensureDirForFile(filePath: string): void {
  const dir = dirname(filePath);
  try {
    Deno.mkdirSync(dir, { recursive: true });
  } catch (err) {
    if (!(err instanceof Deno.errors.AlreadyExists)) {
      Logger.error(`Failed to create cache directory ${dir}:`, err);
      throw err;
    }
  }
}

function initEmptyFile(filePath: string): void {
  ensureDirForFile(filePath);

  try {
    Deno.writeTextFileSync(filePath, '{}');
    Logger.log(`Created empty file: ${filePath}`);
  } catch (error) {
    Logger.error(`Failed to write empty file: ${filePath}`, error);
    throw error;
  }
}

function fileExists(filePath: string): boolean {
  try {
    return Deno.statSync(filePath).isFile;
  } catch {
    return false;
  }
}

export const FileUtils = {
  ensureDirForFile,
  fileExists,
  initEmptyFile,
};
