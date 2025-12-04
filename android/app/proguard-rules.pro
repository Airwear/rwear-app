# Add project specific ProGuard rules here.
# Built and Signed by: Simon Pierre
# Google Play Store 2025 Optimization with R8
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep line numbers for crash reporting
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
-keepattributes Exceptions,Signature,*Annotation*

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Add any project specific keep options here:

# Keep React Native and Hermes essentials
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }

# Keep Google Cast
-keep class com.google.android.gms.cast.framework.** { *; }
-keep class com.reactnative.googlecast.** { *; }
-dontwarn com.google.android.gms.cast.**

# Keep Expo modules public API
-keep class expo.modules.** { *; }
-keep class com.reactnative.** { *; }
-dontwarn expo.**

# Keep React Navigation annotations
-keep class androidx.navigation.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**

# OkHttp & Retrofit
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn retrofit2.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-keep class retrofit2.** { *; }

# Application classes
-keep class com.rwear.app.** { *; }
-keep class com.rwear.app.MainActivity { *; }
-keep class com.rwear.app.MainApplication { *; }
-keep class com.rwear.app.BuildConfig { *; }
-keep class com.rwear.app.R { *; }
-keep class com.rwear.app.R$* { <fields>; }

# WebView
-keep class android.webkit.** { *; }
-keep interface android.webkit.** { *; }

# Enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Parcelable
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Avoid warnings for Kotlin metadata
-dontwarn kotlin.**

# Remove debug logging
-assumenosideeffects class android.util.Log {
	public static *** d(...);
	public static *** v(...);
	public static *** i(...);
}

# Optimization settings
-optimizationpasses 5
-dontusemixedcaseclassnames
-verbose
-repackageclasses ''
-allowaccessmodification
-mergeinterfacesaggressively
