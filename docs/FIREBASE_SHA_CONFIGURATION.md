# Configuration SHA-1 pour Firebase et Google Play

## 📋 Résumé des clés de signature

### 1. Clé Google Play App Signing (Production)
**Fournie par Google Play Console**
```
SHA-1: B8:DD:D9:38:B0:16:66:92:40:82:00:30:EE:9D:12:1C:4B:CB:10:5E
```
Cette clé est utilisée par Google Play pour signer automatiquement votre APK/AAB en production.

### 2. Clé de signature locale (Upload Key)
**Keystore**: `C:\Users\C lient\keystores\rwear-app-new.jks`
- **Alias**: `rwear_key`
- **Store Password**: `RwearApp@2025Secure`
- **Key Password**: `RwearApp@2025Secure`

Pour obtenir le SHA-1 de cette clé, exécutez :
```powershell
keytool -list -v -keystore "C:\Users\C lient\keystores\rwear-app-new.jks" -alias rwear_key -storepass "RwearApp@2025Secure"
```

Cherchez la ligne qui commence par `SHA1:` dans la sortie.

---

## 🔧 Procédure de configuration Firebase

### Étape 1 : Ajouter les SHA-1 dans Firebase Console

1. **Accéder à Firebase Console**
   - URL : https://console.firebase.google.com/
   - Sélectionner le projet : **airwear-bfbee**

2. **Ouvrir les paramètres du projet**
   - Cliquer sur l'icône ⚙️ (Settings) en haut à gauche
   - Sélectionner **Project settings**

3. **Ajouter les empreintes SHA**
   - Onglet **General**
   - Défiler jusqu'à **Your apps**
   - Sélectionner l'application Android :
     - Package name : `com.rwear.app`
     - App ID : `1:1019689655061:android:20300ed0cefcc6d012a71c`

4. **Ajouter les deux SHA-1**
   
   a) **Clé Google Play (OBLIGATOIRE)** :
   ```
   B8:DD:D9:38:B0:16:66:92:40:82:00:30:EE:9D:12:1C:4B:CB:10:5E
   ```
   
   b) **Clé Upload locale** (obtenez-la avec keytool ci-dessus)
   ```
   [Votre SHA-1 local à ajouter]
   ```

5. **Sauvegarder**
   - Cliquer sur **Add fingerprint** pour chaque clé
   - Cliquer sur **Save** en bas de page

### Étape 2 : Télécharger le nouveau google-services.json

1. Après avoir sauvegardé les SHA-1, Firebase génère un nouveau fichier
2. Dans la même page, cliquer sur **google-services.json** pour télécharger
3. Remplacer le fichier dans votre projet :
   ```
   C:\Users\C lient\Desktop\rwearapp\google-services.json
   ```

### Étape 3 : Vérification

Après avoir remplacé `google-services.json` :

```powershell
# Nettoyer le build
cd android
.\gradlew clean

# Rebuild release
.\gradlew assembleRelease
```

---

## 📦 Configuration Google Play Console

### Obtenir la clé Google Play App Signing

Si vous avez besoin de récupérer à nouveau cette clé :

1. **Google Play Console** : https://play.google.com/console/
2. Sélectionner votre app **Rwear App**
3. Menu **Setup** → **App signing**
4. Section **App signing key certificate**
5. Copier le **SHA-1 certificate fingerprint**

---

## ⚠️ Points importants

### Pourquoi deux clés ?

1. **Clé Upload (locale)** :
   - Utilisée pour signer votre APK/AAB avant upload sur Google Play
   - Reste sur votre machine
   - Nécessaire pour les tests en développement

2. **Clé App Signing (Google Play)** :
   - Google re-signe votre app avec cette clé avant distribution
   - Les utilisateurs téléchargent l'app signée avec CETTE clé
   - **C'est la clé critique pour Firebase/Cast/Google Sign-In**

### Services nécessitant les SHA-1

- ✅ Firebase Authentication
- ✅ Google Sign-In
- ✅ Google Cast (Chromecast)
- ✅ Firebase Dynamic Links
- ✅ Google Maps API (si utilisé)

---

## 🔍 Vérification post-configuration

Après avoir ajouté les SHA-1 et téléchargé le nouveau `google-services.json` :

1. **Vérifier le fichier** :
```powershell
cat google-services.json | Select-String "oauth_client"
```

2. **Rebuild complet** :
```powershell
cd android
.\gradlew clean
.\gradlew assembleRelease
```

3. **Tester le Cast** :
   - Installer l'APK sur un appareil
   - Ouvrir une vidéo
   - Le bouton Cast doit fonctionner et se connecter au Chromecast

---

## 📝 Commandes utiles

### Obtenir SHA-1 du keystore
```powershell
keytool -list -v -keystore "C:\Users\C lient\keystores\rwear-app-new.jks" -alias rwear_key -storepass "RwearApp@2025Secure"
```

### Obtenir SHA-1 d'un APK signé
```powershell
# Extraire le certificat
keytool -printcert -jarfile "C:\Users\C lient\Desktop\rwearapp\android\app\build\outputs\apk\release\app-release.apk"
```

### Vérifier SHA-256 (parfois demandé aussi)
Cherchez aussi la ligne `SHA256:` dans la sortie de keytool.

---

## 📞 Support

Si le Cast ne fonctionne toujours pas après configuration :

1. Vérifier que les deux SHA-1 sont bien dans Firebase
2. Télécharger à nouveau `google-services.json`
3. Clean build : `.\gradlew clean assembleRelease`
4. Désinstaller complètement l'ancienne version de l'app sur l'appareil
5. Installer la nouvelle version

**Dernière mise à jour** : 22 novembre 2025
