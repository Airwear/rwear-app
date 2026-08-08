# AIRWEAR v5 - Google Play Store Compliance Report

## Build Information
- **Version Name**: 1.0.10
- **Version Code**: 18
- **Build Type**: Release (AAB + APK)
- **Signing Key**: `@12345dom__rwear-app.jks`
- **Signature**: Keystore signed
- **Runtime Status**: Runtime validation required before publication

## Google Play Policy Update - August 2026

- **Requirement**: l'application doit cibler Android 16 (niveau d'API 36) ou une version ulterieure.
- **Deadline Google Play**: 30 aout 2026.
- **Previous non-compliant target**: Android 15 (niveau d'API 35).
- **Action required to keep updates enabled**:
  1. Mettre l'application a jour vers Android 16 (API 36) ou plus.
  2. Publier une version conforme en `versionCode 18` / `versionName 1.0.10`.

## Google Play Requirements

### 1. **Target API Level**
- ✅ **targetSdkVersion**: 36 (Android 16)
- ✅ **compileSdkVersion**: 36
- ✅ **Status**: CONFIGURED FOR COMPLIANCE WITH THE 30 AUGUST 2026 RULE

### 2. **Minimum API Level**
- ✅ **minSdkVersion**: 24 (Android 7.0)
- ✅ **Status**: COMPLIANT

### 3. **Android App Bundle (AAB)**
- ✅ **Format**: App Bundle (.aab)
- ✅ **Dynamic Delivery**: Enabled
- ✅ **Status**: Supported

### 4. **Java Version**
- ✅ **languageVersion**: Java 17
- ✅ **jvmTarget**: 17
- ✅ **Kotlin**: 2.0.21 on the root Android build line
- ✅ **Status**: COMPLIANT

### 5. **64-bit Support**
- ✅ **arm64-v8a**: Supported
- ✅ **armeabi-v7a**: Supported (fallback)
- ✅ **x86/x86_64**: Included in build
- ✅ **Status**: COMPLIANT

### 6. **Permissions**
- ✅ **INTERNET**: Declared (API calls)
- ✅ **ACCESS_FINE_LOCATION**: Declared (fitness tracking)
- ✅ **ACCESS_COARSE_LOCATION**: Declared
- ✅ **ACTIVITY_RECOGNITION**: Declared (pedometer)
- ✅ **RECORD_AUDIO**: Declared (video)
- ✅ **WRITE_EXTERNAL_STORAGE**: Declared
- ✅ **READ_EXTERNAL_STORAGE**: Declared
- ✅ **Status**: COMPLIANT with runtime permissions implementation

### 7. **Network Security**
- ✅ **network_security_config.xml**: Configured
- ✅ **cleartext traffic**: Allowed for localhost development
- ✅ **HTTPS API**: Production endpoint uses HTTPS
- ✅ **Status**: COMPLIANT

### 8. **Signing Configuration**
- ✅ **Algorithm**: SHA256 with RSA
- ✅ **Key**: Release keystore properly configured
- ✅ **Expiration**: Valid production key
- ✅ **Status**: COMPLIANT

### 9. **ProGuard/Minification**
- ✅ **minifyEnabled**: true
- ✅ **shrinkResources**: true
- ✅ **Status**: ENABLED ON RELEASE BUILDS

### 10. **Edge-to-Edge & Notch Support**
- ✅ **SafeAreaView**: Implemented in video players
- ✅ **resizeableActivity**: true
- ✅ **Status**: COMPLIANT

### 11. **Content Rating & Privacy**
- ✅ **Declared Content**: Fitness app with video streaming
- ✅ **Required**: Complete Google Play questionnaire
- ✅ **Privacy Policy**: Must be provided
- ✅ **Status**: REQUIRES USER SETUP

### 12. **Feature Declarations**
- ✅ **Declared Features**:
  - `android.hardware.location`: Optional
  - `android.hardware.camera`: Optional
  - `android.hardware.microphone`: Optional
- ✅ **Status**: COMPLIANT

## Features Implemented

### Core
- ✅ User Authentication (Sign In / Register)
- ✅ Video Streaming & Playback
- ✅ Cast to Google Cast Devices
- ✅ Fitness Tracking (Pedometer, Activity Recognition)
- ✅ Location Services (optional)

### UI/UX
- ✅ Responsive Design (Portrait & Landscape)
- ✅ Netflix-style Cast Button (Responsive positioning)
- ✅ Notch/SafeArea handling
- ✅ Dark Mode Support

### Backend Integration
- ✅ API URL: `https://rwear-sport.octet-group.org/api`
- ✅ Timeout: 15 seconds
- ✅ Retry Logic: Multiple endpoints (/users/login, /login, /auth/login)
- ✅ Token Support: 4 formats (token, access_token, jwt, bearer)

## Pre-Submission Checklist

Before uploading to Google Play Console:

- [ ] Complete Content Rating questionnaire
- [ ] Provide Privacy Policy URL
- [ ] Set up App Signing by Google Play (if not using manual signing)
- [ ] Complete store listing (description, screenshots, categories)
- [ ] Add app icon (512x512 PNG)
- [ ] Test on multiple devices (Android 7 - Android 16)
- [ ] Verify HTTPS API endpoint is working
- [ ] Test user authentication flow
- [ ] Test video casting functionality
- [ ] Validate the new APK and AAB on real devices because a previous generated build was unstable and could close unexpectedly

## Build Artifacts

| File | Size | Type | Location |
|------|------|------|----------|
| app-release.aab | Generated locally | Android App Bundle | android/app/build/outputs/bundle/release |
| app-release.apk | Generated locally | APK release | android/app/build/outputs/apk/release |

## Git Tags

- `v5_playstore_aab` - Production AAB ready for Play Store
- `v5_hybrid_build` - APK v5 with responsive features

## Signing Key Details

**Location**: `@12345dom__rwear-app.jks`
**Store Password**: [Configured in build.gradle]
**Key Alias**: [Configured in build.gradle]
**Key Password**: [Configured in build.gradle]

⚠️ **Security Note**: Credentials are stored in build.gradle. For production CI/CD, use environment variables or Google Play's App Signing service.

## Next Steps

1. Rebuild with Android SDK 36 fully installed if the local machine is not yet aligned.
2. Validate the APK and the AAB on physical devices before any upload.
3. Upload the validated AAB to Google Play Console.
4. Set up app store listing and privacy disclosures.
5. Submit for review only after runtime validation is complete.

---

**Updated**: August 8, 2026
**Version**: 1.0.10 (versionCode 18)
**Status**: Configuration aligned for API 36, runtime validation still required
