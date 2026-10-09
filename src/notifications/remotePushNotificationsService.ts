import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMOTE_PUSH_CHANNEL_ID = 'rwear-remote-push';
const PERMISSION_PROMPTED_STORAGE_KEY = '@remotePushPermissionPrompted';
const LAST_KNOWN_TOKEN_STORAGE_KEY = '@remotePushLastKnownExpoToken';

const SUPPORTED_SERVICES_EVENTS = [
  'services_new_message',
  'services_booking_created',
  'services_booking_cancelled',
  'services_booking_updated',
] as const;

export type ServicesPushEventType = (typeof SUPPORTED_SERVICES_EVENTS)[number];

export type ServicesPushPayload = {
  scope: 'services';
  eventType: ServicesPushEventType;
  conversationId?: string;
  bookingId?: string;
  eventId?: string;
};

export type PushOpenTarget =
  | {
      kind: 'services-conversation';
      conversationId: string;
    }
  | {
      kind: 'services-booking';
      bookingId: string;
    };

export type PushOpenIntent = {
  source: 'startup' | 'tap';
  payload: ServicesPushPayload;
  target: PushOpenTarget;
  notificationId: string;
  dedupeKey: string;
};

export type PushRegistrationStatus =
  | {
      state: 'registered';
      tokenMasked: string;
      tokenChanged: boolean;
    }
  | {
      state:
        | 'unsupported_platform'
        | 'physical_device_required'
        | 'permission_denied'
        | 'project_id_missing'
        | 'token_unavailable';
      reason: string;
    };

export type PushBackendSyncResult =
  | { state: 'not_configured' }
  | { state: 'synced'; tokenChanged: boolean }
  | { state: 'failed'; reason: string };

export type BootstrapPushNotificationsResult = {
  registration: PushRegistrationStatus;
  backendSync: PushBackendSyncResult;
};

export type BootstrapPushNotificationsOptions = {
  requestPermissionsOnStartup: boolean;
  onNotificationOpened: (intent: PushOpenIntent) => void;
  onNotificationReceived?: (payload: ServicesPushPayload) => void;
  authenticatedUserId?: string;
};

export type BootstrapPushNotificationsHandle = {
  cleanup: () => void;
  result: BootstrapPushNotificationsResult;
};

export type RegisterPushTokenInput = {
  userId?: string;
  expoPushToken: string;
  platform: 'android' | 'ios';
  appOwnership: string;
  tokenChanged: boolean;
};

export type DisablePushTokenInput = {
  userId?: string;
  platform: 'android' | 'ios';
};

export interface PushTokenBackendGateway {
  registerPushToken(input: RegisterPushTokenInput): Promise<void>;
  disablePushToken(input: DisablePushTokenInput): Promise<void>;
}

let backendGateway: PushTokenBackendGateway | null = null;
const handledOpenEvents = new Set<string>();

function trace(event: string, details?: Record<string, unknown>) {
  if (details) {
    console.info(`[RemotePush] ${event}`, details);
    return;
  }

  console.info(`[RemotePush] ${event}`);
}

function maskToken(token: string): string {
  if (token.length <= 12) {
    return '***';
  }

  const prefix = token.slice(0, 10);
  const suffix = token.slice(-6);
  return `${prefix}...${suffix}`;
}

function getProjectId(): string | null {
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    null;

  return typeof projectId === 'string' && projectId.trim().length > 0 ? projectId : null;
}

function getAppOwnership(): string {
  const ownership = Constants.appOwnership;
  return typeof ownership === 'string' ? ownership : 'unknown';
}

function toOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function isSupportedServicesEventType(value: unknown): value is ServicesPushEventType {
  return typeof value === 'string' && (SUPPORTED_SERVICES_EVENTS as readonly string[]).includes(value);
}

function isValidBusinessId(value: string | undefined): value is string {
  if (!value) {
    return false;
  }

  return /^[A-Za-z0-9._:-]{1,128}$/.test(value);
}

function parseServicesPayload(data: Notifications.NotificationContent['data']): ServicesPushPayload | null {
  const scope = toOptionalString(data?.scope);
  const eventTypeRaw = toOptionalString(data?.eventType) ?? toOptionalString(data?.type);

  if (scope !== 'services' || !isSupportedServicesEventType(eventTypeRaw)) {
    return null;
  }

  return {
    scope: 'services',
    eventType: eventTypeRaw,
    conversationId: toOptionalString(data?.conversationId),
    bookingId: toOptionalString(data?.bookingId),
    eventId: toOptionalString(data?.eventId),
  };
}

function resolvePushOpenTarget(payload: ServicesPushPayload): PushOpenTarget | null {
  if (payload.eventType === 'services_new_message') {
    if (isValidBusinessId(payload.conversationId)) {
      return {
        kind: 'services-conversation',
        conversationId: payload.conversationId,
      };
    }

    return null;
  }

  if (isValidBusinessId(payload.bookingId)) {
    return {
      kind: 'services-booking',
      bookingId: payload.bookingId,
    };
  }

  if (isValidBusinessId(payload.conversationId)) {
    return {
      kind: 'services-conversation',
      conversationId: payload.conversationId,
    };
  }

  return null;
}

function buildOpenDedupeKey(response: Notifications.NotificationResponse, target: PushOpenTarget, payload: ServicesPushPayload): string {
  const eventKey = payload.eventId ?? response.notification.request.identifier;
  const targetKey = target.kind === 'services-conversation' ? target.conversationId : target.bookingId;
  return `${eventKey}:${response.actionIdentifier}:${target.kind}:${targetKey}`;
}

async function ensureRemotePushChannel(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    await Notifications.setNotificationChannelAsync(REMOTE_PUSH_CHANNEL_ID, {
      name: 'Rwear notifications distantes',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#1B873F',
    });
    trace('android_channel_ready', { channelId: REMOTE_PUSH_CHANNEL_ID });
  } catch (error) {
    console.warn('[RemotePush] android_channel_error', error);
  }
}

async function shouldPromptPermissionThisSession(canAskAgain: boolean): Promise<boolean> {
  if (!canAskAgain) {
    return false;
  }

  try {
    const alreadyPrompted = await AsyncStorage.getItem(PERMISSION_PROMPTED_STORAGE_KEY);
    if (alreadyPrompted === '1') {
      return false;
    }

    await AsyncStorage.setItem(PERMISSION_PROMPTED_STORAGE_KEY, '1');
    return true;
  } catch {
    // Si la persistance échoue, on évite de bloquer l'utilisateur.
    return true;
  }
}

async function registerForRemotePush(requestPermissionsOnStartup: boolean): Promise<
  PushRegistrationStatus & { tokenRaw?: string }
> {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
    return {
      state: 'unsupported_platform',
      reason: `Platforme non supportee: ${Platform.OS}`,
    };
  }

  if (!Device.isDevice) {
    return {
      state: 'physical_device_required',
      reason: 'Un appareil physique est requis pour un token push distant.',
    };
  }

  const permissions = await Notifications.getPermissionsAsync();
  let status = permissions.status;

  if (status !== 'granted' && requestPermissionsOnStartup) {
    const shouldPrompt = await shouldPromptPermissionThisSession(Boolean(permissions.canAskAgain));
    if (shouldPrompt) {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
  }

  if (status !== 'granted') {
    return {
      state: 'permission_denied',
      reason: 'Permission notifications non accordee.',
    };
  }

  await ensureRemotePushChannel();

  const projectId = getProjectId();
  if (!projectId) {
    return {
      state: 'project_id_missing',
      reason: 'EAS projectId introuvable dans la configuration Expo.',
    };
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    const previousToken = await AsyncStorage.getItem(LAST_KNOWN_TOKEN_STORAGE_KEY);
    const tokenChanged = previousToken !== token;
    await AsyncStorage.setItem(LAST_KNOWN_TOKEN_STORAGE_KEY, token);

    return {
      state: 'registered',
      tokenMasked: maskToken(token),
      tokenChanged,
      tokenRaw: token,
    };
  } catch (error) {
    console.warn('[RemotePush] get_expo_push_token_error', error);
    return {
      state: 'token_unavailable',
      reason: 'Impossible de recuperer le token Expo Push (reseau ou configuration).',
    };
  }
}

async function syncTokenWithBackend(
  token: string,
  tokenChanged: boolean,
  authenticatedUserId?: string,
): Promise<PushBackendSyncResult> {
  if (!backendGateway) {
    trace('backend_sync_skipped_not_configured');
    return { state: 'not_configured' };
  }

  try {
    await backendGateway.registerPushToken({
      userId: authenticatedUserId,
      expoPushToken: token,
      platform: Platform.OS,
      appOwnership: getAppOwnership(),
      tokenChanged,
    });

    return {
      state: 'synced',
      tokenChanged,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Erreur inconnue';
    console.warn('[RemotePush] backend_sync_error', reason);
    return {
      state: 'failed',
      reason,
    };
  }
}

function buildIntentFromResponse(
  response: Notifications.NotificationResponse,
  source: 'startup' | 'tap',
): PushOpenIntent | null {
  const payload = parseServicesPayload(response.notification.request.content.data);
  if (!payload) {
    return null;
  }

  const target = resolvePushOpenTarget(payload);
  if (!target) {
    trace('response_ignored_missing_valid_target', {
      source,
      eventType: payload.eventType,
    });
    return null;
  }

  const dedupeKey = buildOpenDedupeKey(response, target, payload);
  if (handledOpenEvents.has(dedupeKey)) {
    trace('response_ignored_duplicate', { source, dedupeKey });
    return null;
  }

  handledOpenEvents.add(dedupeKey);

  return {
    source,
    payload,
    target,
    notificationId: response.notification.request.identifier,
    dedupeKey,
  };
}

export function configurePushTokenBackendGateway(gateway: PushTokenBackendGateway | null): void {
  backendGateway = gateway;
}

export async function disableRemotePushForCurrentDevice(userId?: string): Promise<PushBackendSyncResult> {
  if (!backendGateway) {
    return { state: 'not_configured' };
  }

  try {
    await backendGateway.disablePushToken({
      userId,
      platform: Platform.OS === 'android' ? 'android' : 'ios',
    });
    return { state: 'synced', tokenChanged: false };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Erreur inconnue';
    return { state: 'failed', reason };
  }
}

export async function bootstrapRemotePushNotifications(
  options: BootstrapPushNotificationsOptions,
): Promise<BootstrapPushNotificationsHandle> {
  const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
    const payload = parseServicesPayload(notification.request.content.data);
    if (!payload) {
      return;
    }

    options.onNotificationReceived?.(payload);
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    const intent = buildIntentFromResponse(response, 'tap');
    if (!intent) {
      return;
    }

    options.onNotificationOpened(intent);
  });

  const registration = await registerForRemotePush(options.requestPermissionsOnStartup);

  let backendSync: PushBackendSyncResult = { state: 'not_configured' };
  if (registration.state === 'registered' && registration.tokenRaw) {
    backendSync = await syncTokenWithBackend(
      registration.tokenRaw,
      registration.tokenChanged,
      options.authenticatedUserId,
    );

    trace('token_ready', {
      tokenMasked: registration.tokenMasked,
      tokenChanged: registration.tokenChanged,
      backendSyncState: backendSync.state,
    });
  } else {
    trace('token_not_available', {
      reason: registration.reason,
      state: registration.state,
    });
  }

  try {
    const startupResponse = await Notifications.getLastNotificationResponseAsync();
    if (startupResponse) {
      const startupIntent = buildIntentFromResponse(startupResponse, 'startup');
      if (startupIntent) {
        options.onNotificationOpened(startupIntent);
      }
    }
  } catch (error) {
    console.warn('[RemotePush] startup_last_response_error', error);
  }

  return {
    cleanup: () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    },
    result: {
      registration: registration.state === 'registered'
        ? {
            state: registration.state,
            tokenChanged: registration.tokenChanged,
            tokenMasked: registration.tokenMasked,
          }
        : registration,
      backendSync,
    },
  };
}
