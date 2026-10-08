import {
  Booking,
  ServiceConversation,
  ServiceMessage,
} from '@/src/features/services/types';

// Source locale temporaire pour simuler la messagerie avant connexion back-end.
// Le contrat de cette interface sert de point d'entrée pour une future source API.
// Dominik
export interface MessagingDataSource {
  createConversation(booking: Booking): ServiceConversation;
  createInitialMessages(conversation: ServiceConversation, booking: Booking): ServiceMessage[];
  createClientMessage(conversationId: string, text: string): ServiceMessage;
}

function buildConversationId(bookingId: string) {
  return `svc-conv-${bookingId}`;
}

function buildTimestamp() {
  return new Date().toISOString();
}

export class MockMessagingSource implements MessagingDataSource {
  createConversation(booking: Booking): ServiceConversation {
    const createdAt = buildTimestamp();
    return {
      id: buildConversationId(booking.id),
      professionalId: booking.professionalId,
      professionalName: booking.professionalName,
      professionalAvatarUrl: booking.professionalAvatarUrl,
      bookingId: booking.id,
      offeringTitle: booking.offeringTitle,
      lastMessage: `Votre conversation avec ${booking.professionalName} concernant ${booking.offeringTitle} est ouverte.`,
      lastMessageAt: createdAt,
      unreadCount: 1,
      createdAt,
      updatedAt: createdAt,
    };
  }

  createInitialMessages(conversation: ServiceConversation, booking: Booking): ServiceMessage[] {
    return [
      {
        id: `${conversation.id}-system-open`,
        conversationId: conversation.id,
        sender: 'system',
        text: `Votre conversation avec ${booking.professionalName} concernant ${booking.offeringTitle} est ouverte.`,
        timestamp: conversation.createdAt,
        status: 'sent',
      },
    ];
  }

  createClientMessage(conversationId: string, text: string): ServiceMessage {
    return {
      id: `${conversationId}-${Date.now()}`,
      conversationId,
      sender: 'client',
      text,
      timestamp: buildTimestamp(),
      status: 'sent',
    };
  }
}

export const mockMessagingSource = new MockMessagingSource();