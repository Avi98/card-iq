import { createPermissionHook } from 'expo-modules-core';

import { getPermissionsAsync, requestPermissionsAsync } from './SmsReaderModule';

/**
 * Hook that returns [permissionResponse, requestPermission, getPermission].
 *
 * Usage:
 *   const [status, requestPermission] = useSmsPermissions();
 */
export const useSmsPermissions = createPermissionHook({
  getMethod: getPermissionsAsync,
  requestMethod: requestPermissionsAsync,
});
