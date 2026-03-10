import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base URL configurable via EXPO_PUBLIC_API_URL; fallback vers prod connue
const RAW_API = process.env.EXPO_PUBLIC_API_URL || 'https://rwear-sport.octet-group.org/api';
// Normaliser: enlever slash final
const API_BASE = RAW_API.replace(/\/+$/,'');

// Essais d'endpoints (avec et sans préfixe /api)
const LOGIN_ENDPOINTS = [
  '/users/login',
  '/login',
  '/auth/login',
  '/api/users/login',
  '/api/login',
  '/api/auth/login',
];
const REGISTER_ENDPOINTS = [
  '/users/register',
  '/register',
  '/auth/register',
  '/api/users/register',
  '/api/register',
  '/api/auth/register',
];
const DELETE_ACCOUNT_ENDPOINTS = [
  '/user',
  '/users/me',
  '/users/account',
  '/api/user',
  '/api/users/me',
  '/api/users/account',
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    let lastError: any = null;
    for (const ep of LOGIN_ENDPOINTS) {
      try {
        const response = await axios.post(`${API_BASE}${ep}`, { email, password });
        const data = response.data || {};
        const token = data.token || data.access_token || data.jwt || data.bearer || data?.user?.token;
        const userData = data.user || data;

        if (!token) {
          console.warn('[AuthContext][login] Token manquant dans la réponse');
        }

        await AsyncStorage.setItem('auth_token', token || '');
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return; // succès
      } catch (e: any) {
        lastError = e;
        const status = e?.response?.status;
        // Continuer si 404, stopper sinon
        if (status && status !== 404) break;
      }
    }
    console.error('Login error:', lastError?.response?.status, lastError?.message);
    throw lastError || new Error('Login failed');
  };

  const register = async (name: string, email: string, password: string) => {
    let lastError: any = null;
    for (const ep of REGISTER_ENDPOINTS) {
      try {
        const response = await axios.post(`${API_BASE}${ep}`, { name, email, password });
        const data = response.data || {};
        const token = data.token || data.access_token || data.jwt || data.bearer || data?.user?.token;
        const userData = data.user || data;

        // Option: ne pas auto-login; ici on suit ancien comportement: auto-login
        await AsyncStorage.setItem('auth_token', token || '');
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return;
      } catch (e: any) {
        lastError = e;
        const status = e?.response?.status;
        if (status && status !== 404) break;
      }
    }
    console.error('Register error:', lastError?.response?.status, lastError?.message);
    throw lastError || new Error('Register failed');
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const deleteAccount = async () => {
    let lastError: any = null;
    for (const ep of DELETE_ACCOUNT_ENDPOINTS) {
      try {
        await axios.delete(`${API_BASE}${ep}`);
        await logout();
        return;
      } catch (e: any) {
        lastError = e;
        const status = e?.response?.status;
        if (status && status !== 404) break;
      }
    }
    console.error('Delete account error:', lastError?.response?.status, lastError?.message);
    throw lastError || new Error('Delete account failed');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        deleteAccount,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
