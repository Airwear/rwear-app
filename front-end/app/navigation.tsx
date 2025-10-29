import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ==========================================
// ROOT STACK (Navigation principale)
// ==========================================
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  VideoCast: {
    videoId: string;
    videoUrl: string;
    title: string;
    thumbnail?: string;
  };
  VideoPlayer: {
    videoId: string;
    videoUrl: string;
    title: string;
    description?: string;
  };
  WorkoutDetail: {
    workoutId: string;
  };
  Settings: undefined;
  CastDevices: undefined;
};

// ==========================================
// AUTH STACK (Authentification)
// ==========================================
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Onboarding: undefined;
};

// ==========================================
// MAIN TABS (Navigation par onglets)
// ==========================================
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  WorkoutsTab: NavigatorScreenParams<WorkoutStackParamList>;
  LibraryTab: NavigatorScreenParams<LibraryStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ==========================================
// HOME STACK
// ==========================================
export type HomeStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Search: {
    query?: string;
  };
};

// ==========================================
// WORKOUT STACK
// ==========================================
export type WorkoutStackParamList = {
  WorkoutList: {
    category?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  WorkoutDetail: {
    workoutId: string;
  };
  WorkoutSession: {
    workoutId: string;
    exercises: string[];
  };
};

// ==========================================
// LIBRARY STACK
// ==========================================
export type LibraryStackParamList = {
  Library: undefined;
  MyWorkouts: undefined;
  Favorites: undefined;
  History: undefined;
};

// ==========================================
// PROFILE STACK
// ==========================================
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Subscription: undefined;
  Help: undefined;
  About: undefined;
};

// ==========================================
// TYPES HELPERS POUR SCREENS
// ==========================================

// Root Stack Screen Props
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

// Auth Stack Screen Props
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

// Main Tabs Screen Props
export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  BottomTabScreenProps<MainTabParamList, T>;

// Home Stack Screen Props
export type HomeStackScreenProps<T extends keyof HomeStackParamList> = 
  NativeStackScreenProps<HomeStackParamList, T>;

// Workout Stack Screen Props
export type WorkoutStackScreenProps<T extends keyof WorkoutStackParamList> = 
  NativeStackScreenProps<WorkoutStackParamList, T>;

// Library Stack Screen Props
export type LibraryStackScreenProps<T extends keyof LibraryStackParamList> = 
  NativeStackScreenProps<LibraryStackParamList, T>;

// Profile Stack Screen Props
export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = 
  NativeStackScreenProps<ProfileStackParamList, T>;

// ==========================================
// TYPES POUR LES DONNÉES
// ==========================================

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number; // en secondes
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  createdAt: string;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  exercises: Exercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  caloriesBurned: number;
  equipment: string[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  restTime: number;
  videoUrl?: string;
  instructions: string;
}

export interface CastDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'airplay';
  isConnected: boolean;
}

// ==========================================
// HELPERS DE NAVIGATION
// ==========================================

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
