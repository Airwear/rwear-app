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

---

## ✨ Divers
- Les journaux locaux sont stockés dans `logs/`
- La documentation front est dans `docs/`

---

Développé et maintenu par Dominik (Simon NDENDAH)
Québec, Canada
#eas build --platform ios 
#eas submit --platform ios -- profile production 
