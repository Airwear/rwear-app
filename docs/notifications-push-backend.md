# RWEAR - Guide technique back-end

## Notifications locales, notifications push distantes et integration back-end

Ce guide technique decrit l'integration front-end des notifications push distantes pour Rwear,
en conservant la pile Expo existante et sans activer de seconde messagerie native.
Il est destine au developpeur back-end charge du contrat de donnees, du cycle de vie des tokens,
et de la livraison des evenements de messagerie et de reservations.

Auteur technique: Dominik

## 1) Architecture retenue

### 1.1 Handler global unique

Le handler global reste unique et centralise dans app/_layout.tsx via Notifications.setNotificationHandler.
Aucun second handler concurrent n'est active.

### 1.2 Service dedie push distant

Un service dedie est introduit dans:
- src/notifications/remotePushNotificationsService.ts

Responsabilites du service:
- centraliser permissions + canal Android + recuperation token Expo Push,
- gerer la robustesse en environnement non compatible,
- brancher les listeners de reception et d'ouverture,
- traiter la derniere notification ouverte au demarrage,
- dedoublonner les ouvertures de notification,
- exposer une interface backend TypeScript, volontairement non connectee par defaut.

### 1.3 Navigation

La navigation se fait exclusivement avec Expo Router et les routes existantes:
- conversation Services: /services/messages/[conversationId]
- detail reservation: /planning/[id]

Aucune route nouvelle n'a ete creee.

## 2) Cycle de vie du token Expo Push

1. Verification plateforme:
- uniquement android/ios,
- appareil physique requis.

2. Permissions:
- lecture du statut courant,
- demande uniquement si autorisee et si demarrage configure pour demander,
- protection anti-prompt repetitif via AsyncStorage.

3. Canal Android:
- verification/creation du canal rwear-remote-push.

4. Recuperation token Expo:
- lecture du projectId EAS (expo.extra.eas.projectId / easConfig.projectId),
- getExpoPushTokenAsync({ projectId }).

5. Rotation token:
- comparaison avec dernier token connu en local,
- exposition tokenChanged pour futur backend.

6. Journalisation:
- token jamais logge en clair,
- uniquement token masque.

## 3) Responsabilites front-end

Le front-end:
- obtient le token si possible,
- ecoute reception et ouverture de notifications,
- dedoublonne les ouvertures,
- valide les identifiants (conversationId/bookingId) avant navigation,
- n'applique aucune mutation metier automatique sur reservation ou conversation.

Le front-end ne doit pas:
- devenir source de verite metier,
- simuler un enregistrement serveur reussi,
- supposer un traitement background garanti sans tache native configuree.

## 4) Responsabilites du futur back-end

Le back-end devra:
- enregistrer le token avec contexte utilisateur + appareil,
- gerer la rotation et invalidation token,
- desactiver token a la deconnexion si necessaire,
- construire des payloads conformes au contrat TypeScript,
- garantir idempotence des evenements (eventId recommande),
- definir la strategie anti-doublon entre push distant et notifications locales.

## 5) Contrat TypeScript des payloads

Type d'evenement supporte:
- services_new_message
- services_booking_created
- services_booking_cancelled
- services_booking_updated

Structure attendue:
- scope: "services"
- eventType: ServicesPushEventType
- conversationId?: string
- bookingId?: string
- eventId?: string (recommande pour dedoublonnage inter-systemes)

Regles de navigation:
- services_new_message -> conversationId valide requis -> /services/messages/[conversationId]
- services_booking_* -> bookingId valide prioritaire -> /planning/[bookingId]
- fallback possible vers conversation si bookingId absent mais conversationId valide

## 6) Evenements pris en charge

- Nouveau message Services
- Reservation creee
- Reservation annulee
- Mise a jour d'un rendez-vous

Le traitement se limite a la navigation UX contextuelle.
Aucune ecriture metier n'est declenchee par la notification.

## 7) Prerequis Android et EAS

Prerequis minimaux:
- configuration Expo Notifications fonctionnelle,
- projectId EAS present,
- appareil Android physique pour token distant,
- configuration FCM cote projet Expo/EAS pour livraison push reelle (sans exposer de secrets ici).

Important:
- aucune cle sensible n'est inventee,
- aucune modification destructive native n'est lancee.

## 8) Limites Expo Go

Avec Expo Go:
- les notifications locales restent testables,
- la reception push distante depend des limites de l'environnement et de la configuration push,
- le service degrade proprement sans crash si token indisponible.

Ce qui n'est pas garanti en l'etat:
- traitement background avance sans tache native dediee,
- validation complete du flux FCM de production.

## 9) Procedure de test en development build Android

1. Verifier permissions notifications sur appareil.
2. Verifier recuperation token masque dans logs front.
3. Envoyer un push test via Expo Push Service avec payload services valide.
4. Cas a verifier:
- app ouverte: notification recue + event observable,
- app en arriere-plan: ouverture via tap et navigation,
- app fermee puis ouverte via notification: reprise via getLastNotificationResponseAsync.
5. Verifier dedoublonnage sur taps repetes.
6. Verifier absence de regression des notifications locales.

## 10) Statut d'integration backend

Statut actuel:
- interface backend TypeScript presente,
- aucun endpoint fictif appele,
- aucune simulation de succes serveur.

Point de raccord futur:
- injecter un PushTokenBackendGateway reel (registerPushToken / disablePushToken).

---

Signature technique: Dominik
