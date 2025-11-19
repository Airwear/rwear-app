# Migration vers Java 21 (Android)

## Contexte
Initialement sur Java 17 / AGP 8.2.2 / Gradle 8.10.2. Objectif: passer à Java 21 en conservant la stabilité Expo/React Native.

## Étapes clés
1. Vérification build baseline Java 17 (échec dû à datetimepicker) ➜ upgrade dépendance.
2. Correction chemin Windows trop long (espace dans profil) causant échec build natif reanimated (ninja) ➜ déplacement du repo vers chemin court.
3. Mise à jour dépendance `@react-native-community/datetimepicker` et suppression patch.
4. Upgrade AGP 8.2.2 → 8.5.0 + Gradle wrapper 8.10.2 → 8.7 (compatibilité JDK 21).
5. Configuration toolchain Java 21 (`JavaLanguageVersion.of(21)`) + `compileOptions` source/target 21.
6. Build release de validation (`assembleRelease`) + génération APK signé.
7. Ajout scripts PowerShell (Build-APK / Install-APK) pour automatiser.

## Fichiers modifiés principaux
- `front-end/app/android/build.gradle` (classpath AGP)
- `front-end/app/android/app/build.gradle` (toolchain & compileOptions Java 21)
- `front-end/app/android/gradle/wrapper/gradle-wrapper.properties` (distributionUrl → gradle-8.7)
- Suppression patch datetimepicker (`patches/@react-native-community+datetimepicker+*.patch`)

## Commandes de build
```powershell
cd front-end/app
npx expo prebuild --clean
cd android
./gradlew assembleRelease --no-daemon
```
APK attendu: `front-end/app/android/app/build/outputs/apk/release/app-release.apk`.

## Scripts
- `android/Build-APK.ps1`: assemble release signé.
- `android/Install-APK.ps1`: build (optionnel), installe et lance sur device ADB.

## Installation sur device
```powershell
pwsh -File front-end/app/android/Install-APK.ps1 -Variant release
```
Paramètres utiles: `-SkipBuild`, `-SkipLaunch`, `-AdbPath", `-ApkPath`.

## Points de vigilance
- S'assurer d'ADB présent (`adb version`).
- Nettoyer prébuild Expo après modifications natives majeures.
- Eviter chemins avec espaces ou très longs pour builds natifs.

## Merge recommandé
1. Tester APK sur device réel (cast, auth, vidéo).
2. Merge branche `verif-app-mobile` vers `main` puis `develop`.
3. Supprimer branche `verif-app-mobile` après validation.

## Commandes merge (exemple)
```bash
git checkout main
git pull
git merge verif-app-mobile
# ou git checkout verif-app-mobile && git rebase main puis fast-forward

git checkout develop
git pull
git merge verif-app-mobile

git branch -d verif-app-mobile
git push origin --delete verif-app-mobile
```

## Résultats
- Build release Java 21 fonctionnel.
- Dépendances critiques mises à jour.
- Scripts disponibles pour accélérer la validation.

---
Document créé le 19/11/2025.
