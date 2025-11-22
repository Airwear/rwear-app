# Configuration SHA-1 / Clés de signature – Firebase & Google Play

## 📋 Résumé des clés de signature

### 1. Clé Google Play App Signing (Production)
**Fournie par Google Play Console (App Signing Key)**
```
SHA-1 (exemple) : B8:DD:D9:38:B0:16:66:92:40:82:00:30:EE:9D:12:1C:4B:CB:10:5E
```
Google Play re-signe votre bundle avec cette clé avant distribution. Vous ne signez JAMAIS localement avec celle-ci.

### 2. Clé Upload (celle attendue par Play lors de l’envoi AAB)
**Keystore actuel utilisé (après changement)**: `C:\Users\C lient\keystores\rwear-app-new.jks`
- **Alias**: `rwear_key`
- **SHA-1 actuel (observé)**: `1C:08:81:16:E6:7C:A6:DB:44:1E:A7:54:A5:76:E7:E4:B6:8E:43:8F`

**Empreinte SHA-1 attendue par Play (message d’erreur)**: `25:25:7B:2B:DA:48:1B:34:EA:1E:F5:0B:C4:B9:D9:04:F9:A3:04:F0`

Cela signifie que votre compte Play Console est encore configuré pour une ancienne Upload Key (ou qu’un reset n’a pas encore pris effet). Tant que l’empreinte attendue ≠ empreinte du keystore utilisé, l’AAB est rejeté.

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

4. **Ajouter les SHA-1 nécessaires**
   
   a) **Clé Google Play (OBLIGATOIRE)** :
   ```
   B8:DD:D9:38:B0:16:66:92:40:82:00:30:EE:9D:12:1C:4B:CB:10:5E
   ```
   
   b) **Clé Upload (si utilisée pour des services exigeant SHA)** : ajoutez l’empreinte de la clé d’upload que vous UTILISEZ réellement. Si vous venez de changer de keystore, ajoutez la nouvelle empreinte ET conservez l’ancienne si elle figure encore dans des builds distribués.

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

### Obtenir les certificats (App Signing & Upload Key)

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
   - Sert uniquement à envoyer le bundle sur Play.
   - Doit correspondre à l’empreinte SHA-1 dans la section "Upload key certificate" de Play Console.
   - Si vous perdez le keystore: demander un RESET d’Upload Key et générer une NOUVELLE clé (Google ne génère pas l’upload key pour vous, vous fournissez son certificat).

2. **Clé App Signing (Google Play)** :
   - Clé gérée par Google. Les utilisateurs reçoivent l’APK/AAB signé avec elle.
   - Firebase peut avoir besoin de SON empreinte si vous utilisez des flux sensibles (Auth, Dynamic Links). Ajoutez-la dans Firebase.

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

## 🔁 Migration / Reset Upload Key

### Cas: Play demande une ancienne empreinte (ex: `25:25:7B:...`) mais vous signez avec une nouvelle (`1C:08:81:...`)
1. Vérifier dans Play Console > App Integrity la section **Upload key certificate**. Si l’empreinte affichée est l’ancienne, le reset n’a pas été appliqué.
2. Si vous avez l’ancien keystore, réutilisez-le pour signer le bundle.
3. Si perdu: demander un **Upload Key reset** (Contact Support) puis:
   ```powershell
   # Générer nouvelle upload key
   keytool -genkeypair -alias upload -keyalg RSA -keysize 2048 -validity 9125 -keystore rwear-upload-reset.jks -storepass NouveauPass -dname "CN=Airwear, OU=Engineering, O=Airwear, L=Paris, ST=Ile-de-France, C=FR"
   # Exporter certificat
   keytool -export -rfc -alias upload -keystore rwear-upload-reset.jks -storepass NouveauPass -file upload-key.pem
   ```
4. Envoyer `upload-key.pem` au support Play quand ils le demandent.
5. Attendre confirmation (quelques heures) puis signer vos AAB avec `rwear-upload-reset.jks`.
6. Ajouter la NOUVELLE empreinte dans Firebase si nécessaire.

### Vérifier empreintes locales
```powershell
keytool -list -v -keystore "C:\Users\C lient\keystores\rwear-app-new.jks" -alias rwear_key -storepass RwearApp@2025Secure | Select-String "SHA1:" 
```

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
