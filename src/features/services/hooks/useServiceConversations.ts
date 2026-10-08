import { useEffect, useMemo, useState } from 'react';
import { messagingService } from '@/src/features/services/services/messagingService';
import {
  hydrateMessagingState,
  isMessagingStateHydrated,
  useMessagingStateSnapshot,
} from '@/src/features/services/stores/servicesMessagingStore';
import { Booking, ServiceConversation, ServiceMessage } from '@/src/features/services/types';

// Hooks de façade pour les écrans Services.
// Ils exposent un état prêt à l'UI, pendant que la source reste locale.
// Quand l'API existera, l'interface de ces hooks doit rester la plus stable possible.
// Dominik
function sortConversations(items: ServiceConversation[]) {
  return [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function useServiceConversations() {
  const { conversations } = useMessagingStateSnapshot();
  const [loading, setLoading] = useState(!isMessagingStateHydrated());

  useEffect(() => {
    if (isMessagingStateHydrated()) {
      setLoading(false);
      return;
    }

    hydrateMessagingState()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const orderedConversations = useMemo(() => sortConversations(conversations), [conversations]);
  const totalUnreadCount = useMemo(
    () => orderedConversations.reduce((count, item) => count + item.unreadCount, 0),
    [orderedConversations],
  );

  return {
    conversations: orderedConversations,
    totalUnreadCount,
    hasConversations: orderedConversations.length > 0,
    loading,
  };
}

export function useBookingConversation(booking: Booking | null) {
  const { conversations } = useServiceConversations();

  const existingConversation = useMemo(
    () => (booking ? conversations.find((item) => item.bookingId === booking.id) || null : null),
    [booking, conversations],
  );

  // Si le rendez-vous est annulé, on autorise seulement l'ouverture d'une conversation déjà existante.
  const canContactProfessional = Boolean(booking) && (booking!.status !== 'cancelled' || Boolean(existingConversation));

  const openConversation = async () => {
    if (!booking) {
      return null;
    }

    return messagingService.openConversationForBooking(booking);
  };

  return {
    existingConversation,
    canContactProfessional,
    openConversation,
  };
}

export function useConversationThread(conversationId: string) {
  const { conversations, messagesByConversation } = useMessagingStateSnapshot();
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(!isMessagingStateHydrated());

  useEffect(() => {
    if (isMessagingStateHydrated()) {
      setLoading(false);
      return;
    }

    hydrateMessagingState()
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const conversation = useMemo(
    () => conversations.find((item) => item.id === conversationId) || null,
    [conversationId, conversations],
  );
  const messages = useMemo<ServiceMessage[]>(() => messagesByConversation[conversationId] || [], [conversationId, messagesByConversation]);

  useEffect(() => {
    if (!conversationId) {
      return;
    }
    // À l'ouverture du thread, on remet les non-lus à zéro côté client.
    messagingService.markAsRead(conversationId).catch(() => {});
  }, [conversationId]);

  const sendMessage = async (text: string) => {
    setSending(true);
    try {
      return await messagingService.sendClientMessage(conversationId, text);
    } finally {
      setSending(false);
    }
  };

  return {
    conversation,
    messages,
    loading,
    sending,
    sendMessage,
  };
}