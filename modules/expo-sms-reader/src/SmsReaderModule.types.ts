import { PermissionResponse } from 'expo-modules-core';

export type { PermissionResponse };

export interface SmsMessage {
  /** Unique SMS record ID (string to avoid JS Number precision loss). */
  id: string;
  /** Sender phone number or shortcode. */
  address: string;
  /** Full message body. */
  body: string;
  /** Send timestamp as epoch milliseconds. */
  date: number;
  /** Whether the message has been read. */
  read: boolean;
}

export interface GetSmsOptions {
  /** Maximum number of messages to return. Defaults to 50. */
  maxCount?: number;
  /** Only return messages newer than this epoch ms. 0 means no filter. */
  afterTimestampMs?: number;
}
