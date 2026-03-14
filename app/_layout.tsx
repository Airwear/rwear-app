import '@/i18n'; // initialise i18next + expo-localization
import { AuthProvider } from '@/contexts';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, StrictMode } from 'react';
import 'react-native-reanimated';
// import 'expo-dev-client';   // ❌ retiré pour la build de prod
// import { FBMessageProvider } from '@/contexts/fbmContext';
import { AppProvider } from '@/contexts/appContext';
import { Text } from '@/components/Themed';

// Use Firebase notification
// <FBMessageProvider>
// Put the App here
// </FBMessageProvider>

export const unstable_settings = {
  // Route d'entrée: écran de bienvenue avant authentification
  initialRouteName: 'welcome',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      {/** @ts-ignore */}
      <AuthProvider>
        <StrictMode>
          <RootAppLayout />
        </StrictMode>
      </AuthProvider>
    </AppProvider>
  );
}

function RootAppLayout() {
  return (
    <>
    <StatusBar style="auto" />
    <Stack>
      <Stack.Screen
        name="welcome"
        options={{ headerShown: false, title: 'Bienvenue' }}
      />
      <Stack.Screen
        name="verify-email"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="sign-in"
        options={{ headerShown: true, title: 'Connexion' }}
      />
      <Stack.Screen
        name="register"
        options={{ headerShown: true, title: 'Inscription' }}
      />
      <Stack.Screen
        name="(app)"
        options={{ headerShown: false, title: 'Accueil' }}
      />
    </Stack>
    </>
  );
}