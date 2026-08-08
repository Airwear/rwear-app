import React, { useEffect } from 'react';
import SessionExpiredModal from './components/SessionExpiredModal';
import { useAuth, AuthProvider } from './src/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text, BackHandler, Platform, ToastAndroid } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import type { RootStackParamList } from './src/navigation';
import { CastProvider } from './src/context/CastContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';


const navigationRef = createNavigationContainerRef<RootStackParamList>();
const rootRoutes: Array<keyof RootStackParamList> = ['Login', 'Welcome', 'Home'];

function RootWithSessionModal() {
  const { sessionExpired, setSessionExpired } = useAuth();
  const navigation = useNavigation();

  const handleReconnect = () => {
    setSessionExpired(false);
    navigation.navigate('Login' as never);
  };

  return (
    <>
      <StartupGate />
      <SessionExpiredModal visible={sessionExpired} onReconnect={handleReconnect} />
    </>
  );
}

function StartupGate() {
  const { isDark } = useTheme();
  const { isLoading } = useAuth();

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    let lastBackPress = 0;

    const onBackPress = () => {
      if (!navigationRef.isReady()) {
        return true;
      }

      const currentRoute = navigationRef.getCurrentRoute()?.name as keyof RootStackParamList | undefined;

      if (currentRoute && rootRoutes.includes(currentRoute)) {
        const now = Date.now();
        if (now - lastBackPress < 2000) {
          BackHandler.exitApp();
          return true;
        }

        lastBackPress = now;
        ToastAndroid.show('Appuyez encore pour quitter', ToastAndroid.SHORT);
        return true;
      }

      if (navigationRef.canGoBack()) {
        navigationRef.goBack();
        return true;
      }

      navigationRef.navigate('Home');
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Chargement…</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AuthProvider>
              <CastProvider>
                <RootWithSessionModal />
              </CastProvider>
            </AuthProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
