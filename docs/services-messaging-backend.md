# Messagerie Services - préparation intégration back-end

## 1) Architecture actuelle

La messagerie Services fonctionne aujourd'hui en local dans l'application:

- un store local en mémoire + AsyncStorage pour persister les conversations/messages,
- un service applicatif pour les opérations métier,
- des hooks React pour exposer un état prêt pour les écrans,
- des écrans de liste et de détail conversation,
- une source mock qui génère les conversations/messages tant que l'API n'est pas branchée.

Ce qui existe déjà:

- navigation fonctionnelle depuis Services et depuis le détail d'un rendez-vous,
- création locale d'une conversation liée à un rendez-vous,
- envoi local de message client,
- marquage local des conversations en lu,
- compteur de non lus côté client.

Ce qui reste à développer:

- source API réelle, synchronisation serveur, temps réel et notifications.

## 2) Fichiers et responsabilités

- app/services/messages/index.tsx
  - Route Expo Router de la liste des conversations.
- app/services/messages/[conversationId].tsx
  - Route Expo Router du détail conversation.
- src/features/services/screens/ConversationsScreen.tsx
  - UI liste des conversations + navigation vers un thread.
- src/features/services/screens/ConversationScreen.tsx
  - UI thread, saisie, envoi, lecture, comportement clavier Android.
- src/features/services/screens/ServicesHomeScreen.tsx
  - Entrée vers la messagerie + résumé non lus.
- src/features/services/screens/BookingDetailScreen.tsx
  - Action "Contacter le professionnel" / "Voir la conversation" liée au rendez-vous.
- src/features/services/hooks/useServiceConversations.ts
  - Façade React pour liste, thread, non lus, ouverture conversation liée booking.
- src/features/services/services/messagingService.ts
  - Orchestration métier (liste, récupération, création, envoi, lecture).
- src/features/services/stores/servicesMessagingStore.ts
  - Stockage local (mémoire + AsyncStorage), hydratation et mutations.
- src/features/services/data/mockMessagingSource.ts
  - Génération locale des objets conversation/message tant qu'il n'y a pas d'API.
- src/features/services/components/ConversationListItem.tsx
  - Rendu d'une ligne conversation.
- src/features/services/components/MessageBubble.tsx
  - Rendu d'un message dans le thread.
- src/features/services/types/index.ts
  - Types métier Booking/Conversation/Message.

## 3) Modèles de données réellement utilisés

Types principaux (src/features/services/types/index.ts):

- ServiceConversation
  - id
  - professionalId
  - professionalName
  - professionalAvatarUrl?
  - bookingId
  - offeringTitle
  - lastMessage
  - lastMessageAt
  - unreadCount
  - createdAt
  - updatedAt

- ServiceMessage
  - id
  - conversationId
  - sender (client | professional | system)
  - text
  - timestamp
  - status (sending | sent | delivered | read | failed)

- ServiceMessagingState
  - conversations: ServiceConversation[]
  - messagesByConversation: Record<string, ServiceMessage[]>

## 4) Identifiants de liaison

Liaisons actuellement observées:

- rendez-vous -> conversation:
  - ServiceConversation.bookingId = Booking.id
- conversation -> professionnel:
  - ServiceConversation.professionalId = Booking.professionalId
- conversation -> messages:
  - ServiceMessage.conversationId = ServiceConversation.id
- conversation id local:
  - format actuel: svc-conv-{bookingId}

Important:

- il n'y a pas encore d'identifiant serveur de conversation/message.
- l'utilisateur côté messagerie n'est pas encore relié à un identifiant back-end explicite dans ce module.

## 5) Opérations actuellement disponibles

Opérations implémentées côté app:

- création/ouverture conversation pour un rendez-vous:
  - MessagingService.openConversationForBooking
- lister les conversations:
  - MessagingService.getConversations + hook useServiceConversations
- récupérer une conversation:
  - MessagingService.getConversationById
- récupérer les messages d'une conversation:
  - MessagingService.getMessages
- envoyer un message client:
  - MessagingService.sendClientMessage
- marquer une conversation en lu:
  - MessagingService.markAsRead

## 6) Opérations qui nécessiteront une API

À remplacer par des appels back-end:

- création réelle de conversation,
- récupération de la liste des conversations,
- récupération du détail conversation et des messages,
- envoi message client,
- marquage en lu synchronisé,
- calcul des non lus fiable multi-appareil.

## 7) Besoins futurs (non implémentés ici)

- authentification: associer explicitement la messagerie à l'utilisateur connecté côté serveur,
- autorisations: vérifier l'accès à une conversation selon le rendez-vous et le rôle,
- synchronisation: stratégie offline/online et résolution des conflits,
- pagination: liste conversations et historique des messages,
- temps réel: WebSocket/équivalent pour réception instantanée,
- notifications: push en cas de nouveaux messages,
- erreurs: normalisation des erreurs réseau, retries, état d'attente,
- observabilité: traces techniques et métriques de livraison/lecture.

## 8) Règles métier observées

- une conversation est rattachée à un seul rendez-vous (bookingId).
- si une conversation existe déjà pour un rendez-vous, elle est réutilisée.
- un rendez-vous annulé ne crée pas de nouvelle conversation.
- un rendez-vous annulé peut encore ouvrir une conversation existante.
- l'envoi client met à jour lastMessage/lastMessageAt/updatedAt.
- non lus:
  - message client: pas d'incrément côté client,
  - message professional/system: incrément unreadCount,
  - ouverture thread: remise à zéro via markAsRead.

## 9) Limites du fonctionnement local actuel

- données stockées localement uniquement (AsyncStorage), non partagées entre appareils,
- pas de notion d'état serveur source de vérité,
- pas de temps réel,
- pas de pagination,
- pas de gestion avancée des erreurs réseau,
- id de message basé sur Date.now(), suffisant localement mais non robuste pour synchronisation multi-sources.

## 10) Tests Android

Déjà confirmés par l'utilisateur (téléphone réel):

- champ de saisie entièrement visible avec clavier ouvert,
- bouton d'envoi accessible,
- clavier stable,
- défilement sans fermeture du clavier,
- consultation des anciens messages,
- envoi de nouveaux messages.

Restant à réaliser (recommandé avant branchement back-end):

- persistance après redémarrage complet de l'app,
- cas multi-conversations avec volumes de messages plus élevés,
- tests réseau dégradé (lorsque la source API sera branchée),
- validation multi-appareils et cohérence des non lus.

Documentation préparée par Dominik.
