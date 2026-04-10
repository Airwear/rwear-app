package com.rwear.app
import com.reactnative.googlecast.api.RNGCCastContext
import expo.modules.splashscreen.SplashScreenManager

import android.os.Build
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import java.io.File

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    // Crash handler ultra simple: log dans fichier + Logcat + Toast
    Thread.setDefaultUncaughtExceptionHandler { t, e ->
      try {
        val f = File(getExternalFilesDir(null), "crash.log")
        f.appendText("${System.currentTimeMillis()} THREAD=${t.name}\n${e.stackTraceToString()}\n\n")
      } catch (_: Exception) {}
      android.util.Log.e("RWEAR", "UNCAUGHT: ${e.message}", e)
    }
    try {
      android.util.Log.i("RWEAR", "MainActivity.onCreate: START")
      // @generated begin expo-splashscreen - expo prebuild (DO NOT MODIFY)
      SplashScreenManager.registerOnActivity(this)
      // @generated end expo-splashscreen

      // Activer edge-to-edge pour conformité SDK 35 avec rétrocompatibilité
      enableEdgeToEdge()
      // SafeAreaProvider (JS) gère les insets système

    // @generated begin expo-splashscreen - expo prebuild (DO NOT MODIFY) sync-f3ff59a738c56c9a6119210cb55f0b613eb8b6af
    SplashScreenManager.registerOnActivity(this)
    // @generated end expo-splashscreen
      super.onCreate(null)
// @generated begin react-native-google-cast-onCreate - expo prebuild (DO NOT MODIFY) sync-489050f2bf9933a98bbd9d93137016ae14c22faa
    RNGCCastContext.getSharedInstance(this)
// @generated end react-native-google-cast-onCreate

      // Initialisation Google Cast pour permettre la diffusion vers Chromecast
      RNGCCastContext.getSharedInstance(this)

      android.util.Log.i("RWEAR", "MainActivity.onCreate: END")
    } catch (e: Exception) {
      android.util.Log.e("RWEAR", "Crash in onCreate: ${e.message}", e)
      throw e
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than [Activity.moveTaskToBack] in fact.
      super.invokeDefaultOnBackPressed()
  }
}
