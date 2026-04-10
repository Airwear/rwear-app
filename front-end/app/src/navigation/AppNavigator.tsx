import React, { useEffect } from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './index';

import HomeScreen from '../screens/main/HomeScreen';
import VideoPlayer from '../screens/main/VideoPlayer';
import SettingsScreen from '../screens/settings/SettingsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RegistrationScreen from '../screens/auth/RegistrationScreen'; // 🔹 ajouté

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();
const rootRoutes: Array<keyof RootStackParamList> = ['Login', 'Welcome', 'Home'];

export default function AppNavigator() {
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

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} /> {/* 🔹 ajouté */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}