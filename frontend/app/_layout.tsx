import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useSegments, useRouter } from 'expo-router';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Protect routes that require authentication
function useProtectedRoute() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (!isLoading) {
      if (!user && !inAuthGroup) {
        // Redirect to login if not authenticated
        setTimeout(() => {
          router.replace('/login');
        }, 0);
      } else if (user && inAuthGroup) {
        // Redirect to home if already authenticated
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 0);
      }
    }
  }, [user, segments, isLoading]);
}

function RootLayoutNav() {
  useProtectedRoute();

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen 
          name="game-details" 
          options={{ 
            title: 'Game Details',
            presentation: 'modal',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="create-game" 
          options={{ 
            title: 'Create Game',
            presentation: 'modal',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="edit-game" 
          options={{ 
            title: 'Edit Game',
            presentation: 'modal',
            headerShown: false
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
