import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';

export type AppThemePreference = 'system' | 'light' | 'dark';

const THEME_PREFERENCE_KEY = 'app_theme_preference';

function isValidPreference(value: string | null): value is AppThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}

export async function getThemePreference(): Promise<AppThemePreference> {
  try {
    const value = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
    return isValidPreference(value) ? value : 'system';
  } catch {
    return 'system';
  }
}

export async function setThemePreference(value: AppThemePreference): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, value);
  } catch {
    // Keep app usable even if persistence fails.
  }
}

export function applyThemePreference(value: AppThemePreference): void {
  const colorScheme: ColorSchemeName = value === 'system' ? null : value;
  if (typeof Appearance.setColorScheme === 'function') {
    Appearance.setColorScheme(colorScheme);
  }
}
