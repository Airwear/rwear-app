# rwear-app (Front-end Expo / React Native)

Application mobile développée avec **Expo** et **React Native**, conçue pour la plateforme de fitness Airwear.

---

## 🎯 Objectif
Livrer une app fonctionnelle avec cast vidéo, navigation modulaire, et structure évolutive, prête pour publication sur les stores.

---

## 🚀 Fonctionnalités
- 📺 Cast vidéo (Google Cast)
- 🧭 Navigation modulaire (Expo Router + écrans)
- ⚙️ Build natif Android verrouillé
- 🛠️ Scripts PowerShell pour automatisation locale
- 📦 Structure adaptée aux contraintes Expo + natif

---

## 📁 Structure du projet (front-end/app)
```
front-end/app/
  app/                 # Routes Expo Router (screens)
  android/             # Projet Android natif
  assets/              # Images, fonts
  components/          # UI partagée
  constants/, contexts/, hooks/
  services/            # API, clients
  src/                 # Écrans et navigation legacy
  scripts/             # Scripts locaux (PS1, JS)
  logs/                # Journaux locaux (non suivis)
  docs/                # Documentation front
  App.tsx, app.json, babel.config.js, package.json, tsconfig.json, ...
```

---

## 🧪 Environnement
- Expo SDK (voir package.json)
- React Native
- Gradle côté Android
- Windows/PowerShell supportés pour les scripts

---

## 📦 Installation et démarrage
```bash
cd front-end/app
npm install
# Démarrer en mode développement (Expo)
npx expo start
```

### Build Android local (optionnel)
```bash
cd front-end/app
npx expo prebuild --clean
cd android
./gradlew assembleDebug
```

---

## 🔗 Configuration Backend
Le backend Laravel vit dans `backend/`. Configurez l’URL API dans votre couche service (ex: `services/api.ts`) via une variable d’environnement ou une constante `API_BASE_URL`.

---

## 🧰 Scripts utiles
- `scripts/check-backend-url.ps1`: vérifie la configuration d’URL backend
- `scripts/switch-backend.ps1`: change rapidement l’URL du backend
- `android/Build-APK.ps1`: construit un APK release signé (wrapper Gradle)
- `android/Install-APK.ps1`: build (optionnel), installe et lance l'app sur un device ADB (support `-AdbPath`)

### Exemple installation rapide
```powershell
pwsh -File front-end/app/android/Install-APK.ps1 -Variant release
# Avec chemin ADB explicite
pwsh -File front-end/app/android/Install-APK.ps1 -Variant release -AdbPath "C:\platform-tools\adb.exe"
```

### Paramètres clés
- `-SkipBuild`: n'assemble pas avant d'installer (réutilise APK existant)
- `-SkipLaunch`: n'exécute pas l'app après l'installation
- `-AdbPath`: chemin personnalisé vers `adb.exe` si non dans PATH
- `-ApkPath`: chemin manuel vers un APK spécifique

---

## 🔄 Migration Java 21 (Android)
Le projet Android a été migré de Java 17 vers Java 21:
- Gradle wrapper: 8.10.2 → 8.7 (compatibilité AGP)
- Android Gradle Plugin: 8.2.2 → 8.5.0
- Toolchain & `compileOptions`: source/target 21
- Nettoyage dépendance: mise à jour `@react-native-community/datetimepicker` (suppression patch)

### Build natif post-migration
```powershell
cd front-end/app
npx expo prebuild --clean
cd android
./gradlew assembleRelease --no-daemon
```

### Vérification applicationId
`applicationId` détecté automatiquement dans `app/build.gradle` (ex: `com.rwear.app`).

### Problèmes résolus
- Module datetimepicker obsolète (erreurs NativeModuleSpec) → upgrade
- Chemin Windows avec espace provoquant échec ninja/C++ → relocation vers chemin plus court

Pour plus de détails voir `docs/MIGRATION-JAVA21.md`.

---

## ✨ Divers
- Les journaux locaux sont stockés dans `logs/`
- La documentation front est dans `docs/`

---

Développé et maintenu par Dominik (Simon NDENDAH)
Québec, Canada
