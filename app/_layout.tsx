import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SheetProvider } from 'react-native-sheet-transitions';
import '../styles/global.css';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useHandleAndroidBack } from '@/hooks/useHandleAndroidBack';
import { ActivityIndicator, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export const unstable_settings = { anchor: '(tabs)' };
configureReanimatedLogger({ strict: false });

const queryClient = new QueryClient();

// 🔹 Loader global
function AuthGate() {
  const { loading, user } = useAuth();
  const colorScheme = useColorScheme();
  useHandleAndroidBack();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1e40af" />
        <Text className="mt-2 text-blue-700 text-lg">Chargement de l'app...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="(tabs)"/>
          ) : (
            <Stack.Screen name="init-screen" options={{ headerShown: false }} />
          )}
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SheetProvider>
        <AuthProvider>
          <SafeAreaView style={{flex:1}} edges={['left','top','right']}>
            <AuthGate />
          </SafeAreaView>
        </AuthProvider>
      </SheetProvider>
    </GestureHandlerRootView>
  );
}
