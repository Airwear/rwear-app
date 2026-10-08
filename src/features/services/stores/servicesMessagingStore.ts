import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';
import {
  ServiceConversation,
  ServiceMessage,
  ServiceMessagingState,
} from '@/src/features/services/types';

// État de messagerie local persisté sur l'appareil.
// À remplacer (ou compléter) par un cache synchronisé API quand le back-end sera branché.
// Dominik
const MESSAGING_KEY = '@servicesMessagingState';

type Listener = () => void;

const EMPTY_STATE: ServiceMessagingState = {
  conversations: [],
  messagesByConversation: {},
};

let state: ServiceMessagingState = EMPTY_STATE;
let hydrated = false;
let hydrationPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function cloneState(nextState: ServiceMessagingState): ServiceMessagingState {
  return {
    conversations: nextState.conversations,
    messagesByConversation: nextState.messagesByConversation,
  };
}

async function persistState(nextState: ServiceMessagingState) {
  state = cloneState(nextState);
  try {
    await AsyncStorage.setItem(MESSAGING_KEY, JSON.stringify(state));
  } catch {
    // Keep in-memory state even if persistence fails.
  }
  notify();
}

export async function hydrateMessagingState(): Promise<void> {
  if (hydrated) {
    return;
  }

  if (!hydrationPromise) {
    // Une seule hydratation simultanée pour éviter les lectures concurrentes incohérentes.
    hydrationPromise = AsyncStorage.getItem(MESSAGING_KEY)
      .then((raw) => {
        state = raw ? (JSON.parse(raw) as ServiceMessagingState) : EMPTY_STATE;
      })
      .catch(() => {
        state = EMPTY_STATE;
      })
      .finally(() => {
        hydrated = true;
        hydrationPromise = null;
        notify();
      });
  }

  await hydrationPromise;
}

export function subscribeToMessaging(listener: Listener) {
  listeners.add(listener);
  void hydrateMessagingState();
  return () => {
    listeners.delete(listener);
  };
}

export function getMessagingStateSnapshot(): ServiceMessagingState {
  return state;
}

export function isMessagingStateHydrated(): boolean {
  return hydrated;
}

export function getConversationMessagesSnapshot(conversationId: string): ServiceMessage[] {
  return state.messagesByConversation[conversationId] || [];
}

export function getConversationByIdSnapshot(conversationId: string): ServiceConversation | null {
  return state.conversations.find((item) => item.id === conversationId) || null;
}

export function getConversationByBookingIdSnapshot(bookingId: string): ServiceConversation | null {
  // Le bookingId est la clé métier qui relie rendez-vous et conversation.
  return state.conversations.find((item) => item.bookingId === bookingId) || null;
}

export async function createConversationThread(conversation: ServiceConversation, messages: ServiceMessage[]) {
  await hydrateMessagingState();

  const nextConversations = [
    conversation,
    ...state.conversations.filter((item) => item.id !== conversation.id),
  ];

  await persistState({
    conversations: nextConversations,
    messagesByConversation: {
      ...state.messagesByConversation,
      [conversation.id]: messages,
    },
  });
}

export async function appendConversationMessage(message: ServiceMessage) {
  await hydrateMessagingState();

  const currentConversation = getConversationByIdSnapshot(message.conversationId);
  if (!currentConversation) {
    return;
  }

  const nextMessages = [...getConversationMessagesSnapshot(message.conversationId), message];
  // Les messages envoyés par le client ne créent pas de non-lu côté client.
  // Les messages pro/system incrémentent le compteur jusqu'à ouverture de la conversation.
  const unreadCount = message.sender === 'client' ? currentConversation.unreadCount : currentConversation.unreadCount + 1;
  const nextConversation: ServiceConversation = {
    ...currentConversation,
    lastMessage: message.text,
    lastMessageAt: message.timestamp,
    unreadCount,
    updatedAt: message.timestamp,
  };

  const nextConversations = [
    nextConversation,
    ...state.conversations.filter((item) => item.id !== nextConversation.id),
  ];

  await persistState({
    conversations: nextConversations,
    messagesByConversation: {
      ...state.messagesByConversation,
      [message.conversationId]: nextMessages,
    },
  });
}

export async function markConversationAsRead(conversationId: string) {
  await hydrateMessagingState();

  const currentConversation = getConversationByIdSnapshot(conversationId);
  if (!currentConversation || currentConversation.unreadCount === 0) {
    return;
  }

  const nextConversation: ServiceConversation = {
    ...currentConversation,
    unreadCount: 0,
  };

  await persistState({
    conversations: state.conversations.map((item) => (item.id === conversationId ? nextConversation : item)),
    messagesByConversation: state.messagesByConversation,
  });
}

export function useMessagingStateSnapshot(): ServiceMessagingState {
  const snapshot = useSyncExternalStore(subscribeToMessaging, getMessagingStateSnapshot, getMessagingStateSnapshot);

  useEffect(() => {
    void hydrateMessagingState();
  }, []);

  return snapshot;
}