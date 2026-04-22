// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Allow Metro to resolve the local expo-sms-reader module from /modules/
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, 'modules'),
];

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  'expo-sms-reader': path.resolve(__dirname, 'modules/expo-sms-reader'),
};

module.exports = config;
