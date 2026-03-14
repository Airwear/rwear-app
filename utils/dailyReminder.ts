import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const STORAGE_KEY = '@dailyReminderSettings';

export type DailyReminderSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  notificationId: string | null;
};

const DEFAULT_SETTINGS: DailyReminderSettings = {
  enabled: false,
  hour: 20,
  minute: 0,
  notificationId: null,
};

export async function loadReminderSettings(): Promise<DailyReminderSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<DailyReminderSettings>;
    return {
      enabled: parsed.enabled ?? DEFAULT_SETTINGS.enabled,
      hour: parsed.hour ?? DEFAULT_SETTINGS.hour,
      minute: parsed.minute ?? DEFAULT_SETTINGS.minute,
      notificationId: parsed.notificationId ?? DEFAULT_SETTINGS.notificationId,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveReminderSettings(settings: DailyReminderSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

async function ensurePermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('daily-reminder', {
    name: 'Rappel quotidien',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#111111',
  });
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<string | null> {
  const granted = await ensurePermission();
  if (!granted) return null;

  await ensureAndroidChannel();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Rappel entraînement',
      body: "Prenez quelques minutes aujourd'hui pour bouger.",
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
      ...(Platform.OS === 'android' ? { channelId: 'daily-reminder' } : {}),
    } as Notifications.DailyTriggerInput,
  });

  return id;
}

export async function cancelScheduledReminder(notificationId?: string | null): Promise<void> {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
