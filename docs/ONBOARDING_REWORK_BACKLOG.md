# Refonte Onboarding — Backlog validable par lots

Date: 14 mars 2026
Références de décision: ONBOARDING_REWORK_DECISIONS.md

## Contraintes opérationnelles
- Ne pas modifier le code applicatif/métier sans validation explicite préalable.
- Exécuter par lots petits et réversibles.
- Vérifier visuellement + techniquement après chaque lot.

## Lot 1 — Vérification email via backend personnalisé
Objectif: imposer la vérification email avant accès aux fonctionnalités sensibles.

Contenu (spécification):
- Ajouter un état utilisateur « emailVerified » piloté uniquement par backend.
- Écran d’attente de vérification avec actions:
  - Renvoyer l’email de vérification.
  - Rafraîchir le statut de vérification.
- Bloquer les routes/actions sensibles si non vérifié.
- En mode invité, ne pas montrer les actions bloquées (ou afficher CTA connexion/inscription).

Critères d’acceptation:
- Un compte non vérifié ne peut pas accéder aux fonctions sensibles.
- Un compte vérifié accède normalement sans redémarrage forcé.
- Les erreurs token expiré/invalide et les limites de renvoi sont gérées.

Décision majeure à confirmer avant exécution:
- Emplacement exact du « mur de vérification »: global (au niveau navigation) ou local (écran par écran).

## Lot 2 — Onboarding progressif (UX)
Objectif: réduire la friction d’entrée avec divulgation progressive en 3 étapes.

Contenu (spécification):
- Étape 1: création compte (email, mot de passe).
- Étape 2: infos de base (nom, prénom).
- Étape 3: profil sportif (poids, taille, objectifs).
- Remplacer date de naissance texte par DatePicker natif.
- Ajouter sélection pays avec recherche (country picker).
- Prévoir sauvegarde brouillon inter-étapes.

Critères d’acceptation:
- L’utilisateur comprend sa progression et peut revenir en arrière sans perte majeure.
- Chaque étape valide uniquement ses champs.
- Les erreurs sont contextualisées et non bloquantes hors champs invalides.

Décision majeure à confirmer avant exécution:
- Persistance du brouillon: mémoire session uniquement ou stockage local chiffré.

## Lot 3 — Mode invité
Objectif: permettre l’exploration avant conversion en compte.

Contenu (spécification):
- Entrée « Continuer en invité » visible dès l’accueil.
- Périmètre invité: lecture/exploration autorisée, actions sensibles interdites.
- CTAs de conversion contextualisés (création de compte / connexion) au moment opportun.

Critères d’acceptation:
- Un invité peut explorer sans blocage dur initial.
- Les actions sensibles déclenchent une conversion claire.
- Aucune donnée sensible n’est créée côté backend depuis un invité.

Décision majeure à confirmer avant exécution:
- Liste exacte des fonctionnalités sensibles à exclure en invité.

## Lot 4 — Polissage UI (SafeArea, StatusBar, Dark mode)
Objectif: rendre l’interface robuste et lisible sur tous les appareils.

Contenu (spécification):
- Uniformiser SafeAreaView sur écrans concernés.
- Paramétrer expo-status-bar selon thème et contraste.
- Activer palette dynamique basée sur useColorScheme.

Critères d’acceptation:
- Aucun contenu critique coupé par encoche/barre système.
- Contraste lisible pour heure/icônes en clair/sombre.
- Thème appliqué de façon cohérente sur onboarding + écrans d’entrée.

Décision majeure à confirmer avant exécution:
- Source de vérité des tokens couleur: système actuel ou extension minimale des constantes existantes.

## Lot 5 — Internationalisation mixte (expo-localization + i18next)
Objectif: centraliser les textes et supporter changement de langue.

Contenu (spécification):
- Détection locale via expo-localization.
- Ressources de traduction via i18next.
- Externaliser tous les textes onboarding/auth vers clés i18n.

Critères d’acceptation:
- Changement de langue appliqué sans casser les écrans.
- Aucune chaîne statique résiduelle sur le flux onboarding/auth.

Décision majeure à confirmer avant exécution:
- Langues initiales du MVP (proposition: FR + EN).

## Lot 6 — Engagement contenu (notifications + aperçu vidéo)
Objectif: améliorer la rétention quotidienne.

Contenu (spécification):
- Notifications locales quotidiennes (expo-notifications), opt-in clair.
- Thumbnails pour vidéos/catégories.
- Écran aperçu avant lecture: titre, description, durée.

Critères d’acceptation:
- Rappel quotidien configurable et désactivable.
- Chaque contenu entraînement dispose d’une identité visuelle minimale.
- L’aperçu précède la lecture et évite les lancements accidentels.

Décision majeure à confirmer avant exécution:
- Heure par défaut des rappels + stratégie de fallback si permissions refusées.

## Ordre d’exécution recommandé
1. Lot 1 (sécurité accès)
2. Lot 3 (invité)
3. Lot 2 (onboarding progressif)
4. Lot 4 (polissage UI)
5. Lot 5 (i18n)
6. Lot 6 (rétention)

## Validation attendue maintenant
Merci de confirmer le GO pour démarrer le Lot 1 en mode implémentation.
