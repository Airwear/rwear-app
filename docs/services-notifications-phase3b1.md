# RWEAR - Phase 3B.1

## Notifications locales Services (état actuel)

Ce document décrit uniquement l'implémentation locale actuelle pour les rendez-vous Services.
Aucune API serveur de notifications n'est supposée disponible à ce stade.

## Portée implémentée

- Notification locale de confirmation à la création d'un rendez-vous.
- Notification locale de rappel avant le rendez-vous.
- Annulation du rappel local quand le rendez-vous est annulé.
- Notification locale d'annulation après annulation du rendez-vous.

## Service technique

Le service dédié se trouve dans:
- `src/features/services/services/servicesNotificationsService.ts`

Rôle du service:
- centraliser l'appel à `expo-notifications` pour les rendez-vous Services,
- vérifier les permissions sans bloquer le flux métier,
- créer un canal Android dédié aux notifications de rendez-vous,
- stocker localement l'association `bookingId -> notificationId` pour permettre l'annulation,
- éviter les doublons de rappel sur le même rendez-vous.

## Données utilisées pour planifier le rappel

Le rappel est calculé à partir de `booking.startsAt` (date ISO réellement stockée à la réservation).

Règles de sécurité appliquées:
- si `startsAt` est invalide: aucun rappel n'est programmé,
- si le rappel tomberait dans le passé: aucun rappel n'est programmé,
- aucun horaire n'est inventé.

## Délai de rappel

Constante actuelle:
- `SERVICES_REMINDER_LEAD_TIME_MINUTES = 90`

Le délai est volontairement centralisé dans le code pour permettre un futur pilotage par préférences utilisateur ou politique back-end.

## Gestion des permissions

Comportement actuel:
- tentative de demande lors de la confirmation de réservation,
- pas de boucle de demandes répétées dans la même session,
- si refus: la réservation reste créée, sans bloquer l'utilisateur.

## Stockage local utilisé

Clé AsyncStorage:
- `@servicesBookingNotifications`

Contenu:
- identifiant de notification planifiée pour le rappel,
- date de déclenchement attendue,
- date de mise à jour.

Objectif:
- annuler proprement le rappel local quand le rendez-vous est annulé,
- prévenir les reliquats de rappels obsolètes.

## Ce qui devra passer côté serveur (phase ultérieure)

À raccorder plus tard:
- source de vérité des événements de rendez-vous (création, annulation, replanification),
- stratégie de rappel distante (timing configurable par produit),
- idempotence des événements (eventId) pour éviter les doublons multi-clients,
- accusés de réception (envoyé, affiché, ouvert),
- éventuelle personnalisation du contenu notification selon contexte métier.

Important:
- ce document ne présente aucune API hypothétique comme déjà disponible.
- l'implémentation actuelle reste strictement locale au device.
