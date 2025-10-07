import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, MainTabParamList, AuthStackParamList } from '../../navigation';
import Loading from '../components/Loading';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';

// Placeholder screens
const RegisterScreen = () => null;
const WorkoutsScreen = () => null;
const LibraryScreen = () => null;
const ProfileScreen = () => null;
const VideoCastScreen = () => null;
const VideoPlayerScreen = () => null;
const SettingsScreen = () => null;

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
      <Tab.Screen 
        name="WorkoutsTab" 
        component={WorkoutsScreen}
        options={{ title: 'Entraînements' }}
      />
      <Tab.Screen 
        name="LibraryTab" 
        component={LibraryScreen}
        options={{ title: 'Bibliothèque' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Chargement..." />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <RootStack.Screen name="Main" component={MainTabs} />
          <RootStack.Screen name="VideoCast" component={VideoCastScreen} />
          <RootStack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
          <RootStack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </RootStack.Navigator>
  );
}
