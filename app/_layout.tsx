import { Stack } from 'expo-router';

export default function RootLayout(): React.JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0e1322' },
        animation: 'fade',
      }}
    />
  );
}
