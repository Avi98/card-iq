import { requireNativeModule } from 'expo-modules-core';

import type { PermissionResponse, SmsMessage, GetSmsOptions } from './SmsReaderModule.types';

// Resolved via JSI on New Architecture builds; bridge fallback on legacy builds.
const ExpoSmsReader = requireNativeModule('ExpoSmsReader');

/** Returns the current READ_SMS permission status without prompting the user. */
export async function getPermissionsAsync(): Promise<PermissionResponse> {
  return ExpoSmsReader.getPermissionsAsync();
}

/** Shows the system permission dialog requesting READ_SMS access. */
export async function requestPermissionsAsync(): Promise<PermissionResponse> {
  return ExpoSmsReader.requestPermissionsAsync();
}

/**
 * Queries the device SMS inbox.
 * Throws if READ_SMS permission has not been granted.
 */
export async function getSmsMessagesAsync(
  options: GetSmsOptions = {}
): Promise<SmsMessage[]> {
  const { maxCount = 50, afterTimestampMs = 0 } = options;
  return ExpoSmsReader.getSmsMessagesAsync(maxCount, afterTimestampMs);
}
