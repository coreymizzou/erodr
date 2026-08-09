import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErodrStoreProvider } from '@/state/ErodrStore';
import { erodrTheme } from '@/theme/erodrTheme';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ErodrStoreProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
        </ErodrStoreProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
