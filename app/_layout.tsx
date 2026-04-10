import '@/i18n'; // initialise i18next + expo-localization
import { AuthProvider } from '@/contexts';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, StrictMode } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
// import 'expo-dev-client';   // ❌ retiré pour la build de prod
// import { FBMessageProvider } from '@/contexts/fbmContext';
import { AppProvider } from '@/contexts/appContext';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { applyThemePreference, getThemePreference } from '@/utils/themePreference';

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

  useEffect(() => {
    let active = true;

    const loadThemePreference = async () => {
      const preference = await getThemePreference();
      if (active) {
        applyThemePreference(preference);
      }
    };

    loadThemePreference();

    return () => {
      active = false;
    };
  }, []);

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
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const headerBg = isDark ? '#121418' : Colors.white;
  const headerBorder = isDark ? '#2A2E34' : '#eceef2';
  const headerText = isDark ? Colors.white : Colors.darkColor;

  return (
    <>
    <StatusBar style={isDark ? 'light' : 'dark'} />
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: headerBg,
        },
        headerShadowVisible: true,
        headerTitleStyle: {
          color: headerText,
          fontWeight: '700',
        },
        headerTintColor: headerText,
        contentStyle: {
          backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
        },
      }}
    >
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
        options={{
          headerShown: true,
          title: 'Connexion',
          headerStyle: { backgroundColor: headerBg, borderBottomColor: headerBorder, borderBottomWidth: 1 },
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          title: 'Inscription',
          headerStyle: { backgroundColor: headerBg, borderBottomColor: headerBorder, borderBottomWidth: 1 },
        }}
      />
      <Stack.Screen
        name="(app)"
        options={{ headerShown: false, title: 'Accueil' }}
      />
    </Stack>
    </>
  );
}