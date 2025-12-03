# Changelog Auth & Réseau (23-11-2025)

## Modifications principales
- Suppression du header Authorization forcé avec token fictif dans `services/api.ts`.
- BaseURL désormais dynamique via `process.env.EXPO_PUBLIC_API_URL` (fallback: `https://rwear-sport.octet-group.org/api`).
- Correction URLs POLICY / CGU (plus de concaténation invalide).
- Ajout `setAuthToken()` pour injecter le token après login / register.
- Intercepteurs Axios améliorés: logs en mode dev uniquement, messages d'erreur normalisés (`friendlyMessage`).
- Ajout fonction `pingBackend()` pour tester la reachabilité du backend.
- `authContext.tsx` : extraction et stockage du token (cherche plusieurs clés: token, access_token, jwt, bearer, user.token).
- Propagation d'erreurs utilisateur plus claires lors de login/register.
- `signOut` plus rapide (500ms) et retire le token global.

## Étapes pour tester
1. Définir éventuellement la variable d'environnement `EXPO_PUBLIC_API_URL` si vous changez de backend.
2. Rebuilder l'APK debug: `cd android && ./gradlew assembleDebug`.
3. Installer sur l'appareil: `adb install -r app\build\outputs\apk\debug\app-debug.apk`.
4. Lancer l'app, tenter login: vérifier affichage des erreurs si identifiants invalides.
5. En cas d'échec réseau: vérifier `adb logcat | grep "[API]"`.

## À envisager
- Ajouter une clé `EXPO_PUBLIC_API_URL` dans `app.json > expo.extra` pour exposition côté JS.
- Implémenter refresh token si le backend fournit un endpoint adapté.
- Centraliser le mapping de structure de réponse (actuellement on suppose `{ data, error, message }`).
