import { AuthProvider } from '@/contexts';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, StrictMode} from 'react';
import 'react-native-reanimated';
import 'expo-dev-client';
//import { FBMessageProvider } from '@/contexts/fbmContext';
import { AppProvider } from '@/contexts/appContext';
import { Text } from '@/components/Themed';

// Use Firebase notification
// <FBMessageProvider>
// Put the App here
// </FBMessageProvider>

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)',
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

  if (! loaded) {
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
  return <Stack>
    <Stack.Screen name="(app)"  options={{  headerShown: false, title: "Accueil"  }} />
  </Stack>
}

