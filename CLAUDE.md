# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start            # Expo dev server (requires dev client build)
npm run android      # Build and run on Android
npm run ios          # Build and run on iOS
npx expo prebuild    # Regenerate native ios/ and android/ after config changes
```

No linting or test commands — neither ESLint nor a test framework is configured.

## Architecture

CardIQ is a React Native app (Expo SDK 54, New Architecture enabled) using **expo-router** for file-based navigation. The onboarding flow is a multi-step wizard.

**Routing**: `app/` directory drives all routes. Screen components live in `src/screens/` and are re-exported from `app/` route files (e.g., `app/index.tsx` re-exports `src/screens/Step1Screen`). Inline screens also exist directly in route files (e.g., `app/step2.tsx`).

**Current onboarding flow**:
- `app/index.tsx` → `src/screens/Step1Screen.tsx` — Google OAuth sign-in via `expo-auth-session`
- `app/step2.tsx` — Permissions request screen (SMS, Gmail access)
- Steps 3 and 4 are referenced in navigation but not yet implemented

**Auth**: Google OAuth is handled in `Step1Screen` using `expo-auth-session` + `expo-web-browser`. The Google client ID is a placeholder (`YOUR_GOOGLE_CLIENT_ID`) — must be replaced with a real client ID before auth works. The redirect URI scheme is `com.anonymous.CardIQ`.

**Design system**: Dark theme throughout (`#0e1322` background, `#4f46e5` accent/indigo). No shared theme file — colors are inlined per component via `StyleSheet.create`.

**Types**: Shared types in `src/types/` (`auth.ts` defines `User` and `AuthTokens` interfaces).

**Native projects**: `ios/` and `android/` are Expo-generated. Do not edit manually — run `npx expo prebuild` to regenerate after `app.json` changes. The bundle ID/package uses the `anonymous` placeholder and should be updated before release.
