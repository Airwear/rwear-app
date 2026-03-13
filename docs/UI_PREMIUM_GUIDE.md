# UI Premium Guide (AIRWEAR)

Objectif: garder une UI épurée, premium et cohérente sur **tous** les écrans, sans dérive visuelle.

## 1) Principes UX
- Priorité à la lisibilité: 1 action principale claire par écran.
- Hiérarchie visuelle simple: titre -> contexte -> action.
- Espaces généreux, pas de surcharge d’éléments.
- Cohérence: mêmes patterns pour cartes, formulaires, boutons, états.

## 2) Tokens visuels (références)
- Couleurs: utiliser uniquement `constants/Colors.ts`.
- Fond global: `Colors.lightColor` / surfaces blanches.
- Texte principal: `Colors.darkColor`.
- Texte secondaire: `Colors.muted`.
- Action principale: `Colors.primary`.
- Erreur: `Colors.danger`.

## 3) Échelle d’espacement
- Base: 4
- Spacings recommandés: 4, 8, 12, 16, 24, 32
- Règle: préférer 12/16 entre blocs, 8 entre éléments liés.

## 4) Typographie
- Titre écran: 22–28, `700`
- Sous-titre: 13–16, `500/600`
- Texte contenu: 13–14, `400/500`
- Légende/meta: 11–12, `400/500`
- Éviter plus de 3 niveaux de tailles par écran.

## 5) Rayons, bordures, ombres
- Rayon standard: 12
- Rayon fort (hero/cartes majeures): 14–16
- Bordure discrète: `#eceef2`
- Ombres légères uniquement sur CTA/cartes clés (jamais partout)

## 6) Composants à utiliser
- Conteneur écran: `components/FlexContainer.tsx`
- Titres: `components/Title.tsx`
- Boutons: `components/buttons/ButtonSimple.tsx`
- Inputs: `components/inputs/Input.tsx`
- Dropdown: `components/inputs/Dropdown.tsx`
- Loader global: `components/Loader.tsx`

## 7) Patterns d’écran (checklist)
- Header: court + utile (pas de texte long inutile).
- Corps: sections en cartes (`borderRadius` 12–16).
- CTA principal visible sans scroller excessif.
- État vide: message simple + action de retour.
- État erreur: carte légère + message clair + action retry.

## 8) Vidéos (expérience premium)
- Cartes avec image cover nette + infos essentielles (durée, niveau).
- Contraste texte/cover suffisant.
- Player: surface sombre propre, contrôles minimalistes.
- Cast: bouton visible mais non intrusif.

## 9) À éviter
- Mélanger trop de couleurs d’accent.
- Variations arbitraires de padding/radius selon les écrans.
- Multiplication des styles inline.
- Textes trop longs dans les zones d’action.

## 10) Définition de “Done UI”
Un écran est validé si:
- cohérent avec ce guide,
- lisible en 3 secondes,
- action principale évidente,
- pas de surcharge,
- `npx tsc --noEmit` passe.

## 11) Sauvegarde des retouches UI
- Backup courant: `docs/UI_PREMIUM_BACKUP.patch`
- Restaurer toutes les retouches UI: `git apply docs/UI_PREMIUM_BACKUP.patch`
- En cas de conflit après changements récents: `git apply --reject --whitespace=fix docs/UI_PREMIUM_BACKUP.patch`
