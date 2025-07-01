import { Logger } from '@/logger';
import { NtfyService } from '@/ntfy';

function handleExit(reason: string, error?: unknown) {
  Logger.log(`Shutting down: ${reason}`);

  if (error) {
    Logger.error(reason, error);
    const message = error instanceof Error ? error.message : String(error);
    NtfyService.sendErrorNotification(
      `Shutting down due to an error: ${message}`
    )
      .catch((error) => {
        Logger.error('Things went terribly wrong', error);
      })
      .finally(() => Deno.exit(1));
  } else {
    Deno.exit(0);
  }
}

export function setupShutdownHandlers(): void {
  Deno.addSignalListener('SIGINT', () =>
    handleExit('Received SIGINT (CTRL+C)')
  );

  Deno.addSignalListener('SIGTERM', () => handleExit('Received SIGTERM'));

  addEventListener('error', (event) =>
    handleExit('Uncaught Exception', event.error)
  );

  addEventListener('unhandledrejection', (event) =>
    handleExit('Unhandled Rejection', event.reason)
  );
}
