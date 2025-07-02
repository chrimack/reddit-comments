import { assert, assertEquals } from 'jsr:@std/assert';
import { FileUtils } from './file.utils.ts';

// Helper to clean up test files/directories
function cleanup(path: string) {
  try {
    Deno.removeSync(path, { recursive: true });
  } catch {
    // ignore
  }
}

Deno.test('ensureDirForFile creates directory if not exists', () => {
  const testFile = './test-dir/subdir/file.txt';
  cleanup('./test-dir');
  FileUtils.ensureDirForFile(testFile);
  const stat = Deno.statSync('./test-dir/subdir');
  assert(stat.isDirectory);
  cleanup('./test-dir');
});

Deno.test('initEmptyFile creates file with {}', () => {
  const testFile = './test-dir/empty.json';
  cleanup('./test-dir');
  FileUtils.initEmptyFile(testFile);
  const content = Deno.readTextFileSync(testFile);
  assertEquals(content, '{}');
  cleanup('./test-dir');
});

Deno.test('fileExists returns true for existing file', () => {
  const testFile = './test-file.txt';
  Deno.writeTextFileSync(testFile, 'hello');
  assert(FileUtils.fileExists(testFile));
  cleanup(testFile);
});

Deno.test('fileExists returns false for non-existent file', () => {
  const testFile = './does-not-exist.txt';
  cleanup(testFile);
  assertEquals(FileUtils.fileExists(testFile), false);
});
