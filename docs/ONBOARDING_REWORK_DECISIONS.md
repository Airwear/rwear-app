# Refonte Onboarding — Décisions validées

Date: 14 mars 2026

## Règles de conduite
- Aucun changement de code applicatif/métier sans validation explicite.
- Soumettre chaque décision majeure au propriétaire avant implémentation.

## Décisions validées

### 1) Vérification d’email
**Statut:** Validé ✅  
**Choix:** Backend personnalisé (pas Firebase Auth direct).

#### Cadrage technique (non implémenté)
- Le backend émet un email de vérification contenant un token signé + expiration.
- L’endpoint backend confirme le token puis marque l’email comme vérifié.
- Le client ne débloque les fonctionnalités protégées qu’après confirmation backend.
- Prévoir gestion des cas limites: token expiré, token invalide, renvoi d’email, limitation anti-abus.

## Décisions validées (complément)

### 2) Politique d’accès avant vérification email
**Statut:** Validé ✅  
**Choix:** A — Blocage total des fonctionnalités sensibles tant que l’email n’est pas vérifié.

### 3) Mode invité (authentification anonyme)
**Statut:** Validé ✅  
**Choix:** A — Activé (exploration sans compte, conversion plus tard).

### 4) Internationalisation (i18n)
**Statut:** Validé ✅  
**Choix:** C — Mixte: expo-localization pour la détection locale + i18next pour la gestion des ressources de traduction.

## Prochaine étape proposée
- Produire un backlog d’implémentation non-invasif, lot par lot, avec points de validation avant exécution.
- Obtenir ton GO explicite avant chaque lot impactant le code applicatif/métier.
