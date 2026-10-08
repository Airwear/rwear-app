import { mockMessagingSource } from '@/src/features/services/data/mockMessagingSource';
import {
  appendConversationMessage,
  createConversationThread,
  getConversationByBookingIdSnapshot,
  getConversationByIdSnapshot,
  getConversationMessagesSnapshot,
  getMessagingStateSnapshot,
  hydrateMessagingState,
  markConversationAsRead,
} from '@/src/features/services/stores/servicesMessagingStore';
import {
  Booking,
  ServiceConversation,
  ServiceMessage,
} from '@/src/features/services/types';

// Service d'orchestration de la messagerie Services.
// Aujourd'hui, il s'appuie sur un store local + une source mock.
// Quand l'API sera disponible, c'est ce niveau qui restera stable
// pour brancher les appels réseau sans casser les écrans.
// Dominik
export class MessagingService {
  async getConversations(): Promise<ServiceConversation[]> {
    await hydrateMessagingState();
    return getMessagingStateSnapshot().conversations;
  }

  async getConversationById(conversationId: string): Promise<ServiceConversation | null> {
    await hydrateMessagingState();
    return getConversationByIdSnapshot(conversationId);
  }

  async getConversationByBookingId(bookingId: string): Promise<ServiceConversation | null> {
    await hydrateMessagingState();
    return getConversationByBookingIdSnapshot(bookingId);
  }

  async getMessages(conversationId: string): Promise<ServiceMessage[]> {
    await hydrateMessagingState();
    return getConversationMessagesSnapshot(conversationId);
  }

  async openConversationForBooking(booking: Booking): Promise<ServiceConversation | null> {
    await hydrateMessagingState();

    // Une conversation est liée de façon unique au rendez-vous via booking.id.
    const existingConversation = getConversationByBookingIdSnapshot(booking.id);
    if (existingConversation) {
      return existingConversation;
    }

    // Règle métier actuelle: un rendez-vous annulé ne crée pas de nouvelle conversation.
    // Si une conversation existait déjà avant annulation, elle reste consultable.
    if (booking.status === 'cancelled') {
      return null;
    }

    // Création locale provisoire: à remplacer par la création côté serveur.
    const conversation = mockMessagingSource.createConversation(booking);
    const initialMessages = mockMessagingSource.createInitialMessages(conversation, booking);
    await createConversationThread(conversation, initialMessages);
    return conversation;
  }

  async sendClientMessage(conversationId: string, text: string): Promise<ServiceMessage | null> {
    const trimmed = text.trim();
    if (!trimmed) {
      return null;
    }

    await hydrateMessagingState();

    const conversation = getConversationByIdSnapshot(conversationId);
    if (!conversation) {
      return null;
    }

    // En phase locale, le message est généré en mock puis persisté sur le téléphone.
    // Plus tard, ce bloc devra envoyer au back-end puis refléter l'accusé serveur.
    const message = mockMessagingSource.createClientMessage(conversationId, trimmed);
    await appendConversationMessage(message);
    return message;
  }

  async markAsRead(conversationId: string): Promise<void> {
    // Le marquage lu est local pour l'instant; il devra être synchronisé côté API.
    await markConversationAsRead(conversationId);
  }
}

export const messagingService = new MessagingService();