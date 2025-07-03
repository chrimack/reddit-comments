// import { assertStringIncludes } from 'jsr:@std/assert';
// import { Logger } from './logger.ts';

// // Helper to capture console output
// function captureConsole(method: 'log' | 'warn' | 'error', fn: () => void) {
//   const original = console[method];
//   let output = '';
//   console[method] = (...args: unknown[]) => {
//     output += args.map(String).join(' ') + '\n';
//   };
//   try {
//     fn();
//   } finally {
//     console[method] = original;
//   }
//   return output;
// }

// Deno.test('Logger.log writes to console and buffer', () => {
//   const msg = 'info message';
//   const output = captureConsole('log', () => Logger.log(msg, 123));
//   assertStringIncludes(output, msg);
//   assertStringIncludes(output, 'INFO');
// });

// Deno.test('Logger.warn writes to console and buffer', () => {
//   const msg = 'warn message';
//   const output = captureConsole('warn', () => Logger.warn(msg, 'extra'));
//   assertStringIncludes(output, msg);
//   assertStringIncludes(output, 'WARN');
// });

// Deno.test('Logger.error writes to console and buffer', () => {
//   const msg = 'error message';
//   const output = captureConsole('error', () => Logger.error(msg, { foo: 1 }));
//   assertStringIncludes(output, msg);
//   assertStringIncludes(output, 'ERROR');
// });

// Deno.test('Logger.logSummary logs summary info', () => {
//   const userStats = { success: 2, failed: 1 };
//   const notifStats = { success: 3, failed: 0 };
//   const start = Date.now() - 5000;
//   let output = '';
//   const origLog = Logger.log;
//   Logger.log = (msg: string) => {
//     output += msg + '\n';
//   };
//   try {
//     Logger.logSummary(userStats, notifStats, start);
//     assertStringIncludes(output, 'Finished polling 3 users, 1 failed');
//     assertStringIncludes(output, 'Notifications sent: 3 successful, 0 failed');
//     assertStringIncludes(output, 'Polling complete in');
//   } finally {
//     Logger.log = origLog;
//   }
// });

// Deno.test('Logger.flush writes logs to file and clears buffer', async () => {
//   // Write a log to ensure buffer is not empty
//   Logger.log('flush test');
//   await Logger.flush();
//   // Check that the log file exists and contains the log
//   const date = new Date().toISOString().split('T')[0];
//   const filePath = `./logs/${date}.txt`;
//   const data = await Deno.readTextFile(filePath);
//   assertStringIncludes(data, 'flush test');
// });
