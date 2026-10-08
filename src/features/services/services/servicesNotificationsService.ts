import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Booking } from '@/src/features/services/types';

const SERVICES_NOTIFICATIONS_STORAGE_KEY = '@servicesBookingNotifications';
const SERVICES_BOOKING_CHANNEL_ID = 'services-booking-reminders';

// Délai de rappel local avant le début du rendez-vous.
// Conserver cette constante centralisée simplifie le futur alignement
// avec les préférences utilisateur exposées par le back-end.
//
// Dominik
const SERVICES_REMINDER_LEAD_TIME_MINUTES = 90;

type NotificationPermissionState = 'unknown' | 'granted' | 'denied';

type BookingNotificationRecord = {
  reminderNotificationId: string;
  reminderTriggerAt: string;
  updatedAt: string;
};

type BookingsNotificationIndex = Record<string, BookingNotificationRecord>;

let cachedPermission: NotificationPermissionState = 'unknown';
let permissionPromptedThisSession = false;

function trace(event: string, details?: Record<string, unknown>) {
  if (details) {
    console.info(`[ServicesNotifications] ${event}`, details);
    return;
  }

  console.info(`[ServicesNotifications] ${event}`);
}

function getBookingStartDate(booking: Booking): Date | null {
  const startsAt = new Date(booking.startsAt);
  if (Number.isNaN(startsAt.getTime())) {
    return null;
  }

  return startsAt;
}

async function readNotificationsIndex(): Promise<BookingsNotificationIndex> {
  try {
    const raw = await AsyncStorage.getItem(SERVICES_NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as BookingsNotificationIndex;
  } catch {
    return {};
  }
}

async function writeNotificationsIndex(index: BookingsNotificationIndex): Promise<void> {
  try {
    await AsyncStorage.setItem(SERVICES_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(index));
  } catch {
    // La réservation reste valide même si la persistance locale échoue.
  }
}

async function ensureServicesChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    await Notifications.setNotificationChannelAsync(SERVICES_BOOKING_CHANNEL_ID, {
      name: 'Services - Rendez-vous',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#1B873F',
    });
    trace('android_channel_ready', { channelId: SERVICES_BOOKING_CHANNEL_ID });
  } catch (error) {
    console.warn('[ServicesNotifications] android_channel_error', error);
    // Le canal est un plus UX Android, mais ne doit pas casser le flux métier.
  }
}

async function ensureNotificationsPermission(requestIfNeeded: boolean): Promise<boolean> {
  if (cachedPermission === 'granted') {
    return true;
  }

  const current = await Notifications.getPermissionsAsync();
  trace('permission_status_current', {
    status: current.status,
    granted: current.granted,
    canAskAgain: current.canAskAgain,
    requestIfNeeded,
  });

  if (current.status === 'granted') {
    cachedPermission = 'granted';
    return true;
  }

  if (!requestIfNeeded || !current.canAskAgain || permissionPromptedThisSession) {
    cachedPermission = 'denied';
    return false;
  }

  permissionPromptedThisSession = true;
  const requested = await Notifications.requestPermissionsAsync();
  trace('permission_status_requested', {
    status: requested.status,
    granted: requested.granted,
    canAskAgain: requested.canAskAgain,
  });

  cachedPermission = requested.status === 'granted' ? 'granted' : 'denied';
  return cachedPermission === 'granted';
}

function buildConfirmationContent(booking: Booking): Notifications.NotificationContentInput {
  return {
    title: 'Réservation confirmée',
    body: `${booking.offeringTitle} avec ${booking.professionalName} · ${booking.dateLabel} à ${booking.timeLabel}`,
    sound: true,
    data: {
      scope: 'services',
      type: 'booking_confirmation',
      bookingId: booking.id,
    },
  };
}

function buildReminderContent(booking: Booking): Notifications.NotificationContentInput {
  return {
    title: 'Rappel rendez-vous',
    body: `${booking.offeringTitle} avec ${booking.professionalName} à ${booking.timeLabel}`,
    sound: true,
    data: {
      scope: 'services',
      type: 'booking_reminder',
      bookingId: booking.id,
    },
  };
}

async function scheduleBookingConfirmationNotification(booking: Booking): Promise<void> {
  try {
    trace('schedule_confirmation_attempt', {
      bookingId: booking.id,
      platform: Platform.OS,
    });

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: buildConfirmationContent(booking),
      trigger: Platform.OS === 'android'
        ? { channelId: SERVICES_BOOKING_CHANNEL_ID }
        : null,
    });
    trace('schedule_confirmation_success', {
      bookingId: booking.id,
      notificationId,
      channelId: Platform.OS === 'android' ? SERVICES_BOOKING_CHANNEL_ID : undefined,
    });
  } catch (error) {
    console.warn('[ServicesNotifications] schedule_confirmation_error', {
      bookingId: booking.id,
      error,
    });
    // L'échec d'affichage local ne doit jamais invalider une réservation enregistrée.
  }
}

async function scheduleBookingReminderNotification(booking: Booking): Promise<void> {
  const startsAt = getBookingStartDate(booking);
  if (!startsAt) {
    return;
  }

  const reminderAt = new Date(startsAt.getTime() - SERVICES_REMINDER_LEAD_TIME_MINUTES * 60_000);
  if (Number.isNaN(reminderAt.getTime())) {
    return;
  }

  const now = Date.now();
  if (reminderAt.getTime() <= now) {
    return;
  }

  const index = await readNotificationsIndex();
  const existing = index[booking.id];
  const nextTriggerAt = reminderAt.toISOString();

  trace('schedule_reminder_window', {
    bookingId: booking.id,
    startsAt: startsAt.toISOString(),
    reminderAt: nextTriggerAt,
  });

  if (existing && existing.reminderTriggerAt === nextTriggerAt && existing.reminderNotificationId) {
    return;
  }

  // On garde l'identifiant du rappel pour pouvoir l'annuler
  // si le rendez-vous est annulé ou déplacé.
  // Cette association devra rester cohérente lors du câblage serveur.
  //
  // Dominik
  try {
    if (existing?.reminderNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(existing.reminderNotificationId);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: buildReminderContent(booking),
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderAt,
        ...(Platform.OS === 'android' ? { channelId: SERVICES_BOOKING_CHANNEL_ID } : {}),
      } as Notifications.DateTriggerInput,
    });

    trace('schedule_reminder_success', {
      bookingId: booking.id,
      notificationId,
      reminderAt: nextTriggerAt,
    });

    index[booking.id] = {
      reminderNotificationId: notificationId,
      reminderTriggerAt: nextTriggerAt,
      updatedAt: new Date().toISOString(),
    };
    await writeNotificationsIndex(index);
  } catch (error) {
    console.warn('[ServicesNotifications] schedule_reminder_error', {
      bookingId: booking.id,
      error,
    });
    // On ne remonte pas l'erreur pour ne pas casser la création de réservation.
  }
}

async function cancelBookingReminderNotification(bookingId: string): Promise<void> {
  const index = await readNotificationsIndex();
  const existing = index[bookingId];

  if (!existing?.reminderNotificationId) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(existing.reminderNotificationId);
    trace('cancel_reminder_success', {
      bookingId,
      notificationId: existing.reminderNotificationId,
    });
  } catch (error) {
    console.warn('[ServicesNotifications] cancel_reminder_error', {
      bookingId,
      notificationId: existing.reminderNotificationId,
      error,
    });
    // On nettoie quand même l'index local pour éviter des reliquats obsolètes.
  }

  delete index[bookingId];
  await writeNotificationsIndex(index);
}

async function scheduleBookingCancellationNotification(booking: Booking): Promise<void> {
  try {
    trace('schedule_cancellation_attempt', {
      bookingId: booking.id,
      platform: Platform.OS,
    });

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Réservation annulée',
        body: `${booking.offeringTitle} avec ${booking.professionalName} (${booking.dateLabel} à ${booking.timeLabel})`,
        sound: true,
        data: {
          scope: 'services',
          type: 'booking_cancelled',
          bookingId: booking.id,
        },
      },
      trigger: Platform.OS === 'android'
        ? { channelId: SERVICES_BOOKING_CHANNEL_ID }
        : null,
    });
    trace('schedule_cancellation_success', {
      bookingId: booking.id,
      notificationId,
      channelId: Platform.OS === 'android' ? SERVICES_BOOKING_CHANNEL_ID : undefined,
    });
  } catch (error) {
    console.warn('[ServicesNotifications] schedule_cancellation_error', {
      bookingId: booking.id,
      error,
    });
    // La notification d'annulation est informative, jamais bloquante.
  }
}

export class ServicesNotificationsService {
  async onBookingConfirmed(booking: Booking): Promise<void> {
    try {
      trace('booking_confirmed_flow_start', { bookingId: booking.id });
      const granted = await ensureNotificationsPermission(true);
      if (!granted) {
        trace('booking_confirmed_flow_skipped_permission', { bookingId: booking.id });
        return;
      }

      await ensureServicesChannel();
      await scheduleBookingConfirmationNotification(booking);
      await scheduleBookingReminderNotification(booking);
    } catch (error) {
      console.warn('[ServicesNotifications] booking_confirmed_flow_error', {
        bookingId: booking.id,
        error,
      });
      // L'orchestration notifications reste découplée du succès métier.
    }
  }

  async onBookingCancelled(booking: Booking): Promise<void> {
    try {
      trace('booking_cancelled_flow_start', { bookingId: booking.id });
      await cancelBookingReminderNotification(booking.id);

      const granted = await ensureNotificationsPermission(false);
      if (!granted) {
        trace('booking_cancelled_flow_skipped_permission', { bookingId: booking.id });
        return;
      }

      await ensureServicesChannel();
      await scheduleBookingCancellationNotification(booking);
    } catch (error) {
      console.warn('[ServicesNotifications] booking_cancelled_flow_error', {
        bookingId: booking.id,
        error,
      });
      // L'orchestration notifications reste découplée du succès métier.
    }
  }
}

export const servicesNotificationsService = new ServicesNotificationsService();
export { SERVICES_REMINDER_LEAD_TIME_MINUTES };