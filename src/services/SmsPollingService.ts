import { getSmsMessagesAsync } from "expo-sms-reader";
import type { SmsMessage } from "expo-sms-reader";

const POLL_INTERVAL_MS = 5_000;

let pollTimer: ReturnType<typeof setInterval> | null = null;
let lastSeenTimestamp = 0;

/**
 * Starts polling the SMS inbox every 5 seconds.
 * Only messages newer than the last seen timestamp are returned on each tick,
 * so the callback receives incremental batches, not the full inbox.
 *
 * Polling stops automatically if the READ_SMS permission is revoked mid-session.
 * Call stopSmsPoll() explicitly on screen unmount.
 */
export function startSmsPoll(onMessages: (msgs: SmsMessage[]) => void): void {
  if (pollTimer !== null) return;

  pollTimer = setInterval(async () => {
    try {
      const msgs = await getSmsMessagesAsync({
        maxCount: 200,
        afterTimestampMs: lastSeenTimestamp,
      });

      if (msgs.length > 0) {
        lastSeenTimestamp = Math.max(...msgs.map((m) => m.date));
        onMessages(msgs);
      }
    } catch {
      // Permission revoked or content provider error — stop polling silently.
      stopSmsPoll();
    }
  }, POLL_INTERVAL_MS);
}

/** Stops the polling loop. Safe to call when no poll is running. */
export function stopSmsPoll(): void {
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

/** Resets the seen-timestamp so the next poll fetches from the beginning. */
export function resetSmsPoll(): void {
  lastSeenTimestamp = 0;
}
