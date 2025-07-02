import { assert, assertEquals } from 'jsr:@std/assert';
import { CleanupManager } from './cleanup-manager.ts';

// Use a test-specific lock file to avoid impacting the real file
const TEST_LOCK_FILE = './cache/.cleanup.lock.test';

function cleanupLockFile() {
  try {
    Deno.removeSync(TEST_LOCK_FILE);
  } catch {
    // ignore if not present
  }
}

Deno.test({
  name: 'shouldRunCleanup returns true on first run and creates lock file (test file)',
  permissions: { read: true, write: true },
  fn() {
    cleanupLockFile();
    const cleanup = new CleanupManager(TEST_LOCK_FILE);
    const result = cleanup.shouldRunCleanup();
    assert(result);
    assert(Deno.statSync(TEST_LOCK_FILE).isFile);
    cleanupLockFile();
  },
});

Deno.test({
  name: 'shouldRunCleanup returns false if already run today (test file)',
  permissions: { read: true, write: true },
  fn() {
    cleanupLockFile();
    const cleanup = new CleanupManager(TEST_LOCK_FILE);
    cleanup.markCleanupRan();
    const result = cleanup.shouldRunCleanup();
    assertEquals(result, false);
    cleanupLockFile();
  },
});

Deno.test({
  name: "markCleanupRan writes today's date to lock file (test file)",
  permissions: { read: true, write: true },
  fn() {
    cleanupLockFile();
    const cleanup = new CleanupManager(TEST_LOCK_FILE);
    cleanup.markCleanupRan();
    const today = new Date().toISOString().split('T')[0];
    const content = Deno.readTextFileSync(TEST_LOCK_FILE).trim();
    assertEquals(content, today);
    cleanupLockFile();
  },
});
