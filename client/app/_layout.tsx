import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StepCounterProvider } from '../components/StepCounterContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Request permissions on app startup
    const requestPermissions = async () => {
      try {
        // Request location permissions
        await Location.requestForegroundPermissionsAsync();
        // Request activity recognition permission (Android only)
        if (Platform.OS === 'android') {
          await PermissionsAndroid.request(
            'android.permission.ACTIVITY_RECOGNITION',
            {
              title: 'Activity Recognition Permission',
              message: 'DreamFit needs access to your physical activity to count steps.',
              buttonPositive: 'OK',
            }
          );
        }
        
        // Request camera roll permissions
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        console.log('All permissions requested successfully');
      } catch (error) {
        console.log('Error requesting permissions:', error);
      }
    };

    requestPermissions();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <StepCounterProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </StepCounterProvider>
  );
}
