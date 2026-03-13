import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, I18nManager } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CastButton, CastState } from 'react-native-google-cast';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useCasting } from '../hooks/useCasting';
import Colors from '@/constants/Colors';

export default function VideoCastScreen() {
  const params = useLocalSearchParams();
  const videoRef = useRef<Video>(null);
  const { castState, isCasting, isLoading, error, startCasting, stopCasting } = useCasting(
    params.videoUrl as string,
    { title: params.title as string, thumbnail: params.thumbnail as string }
  );

  React.useEffect(() => {
    if (error) {
      Alert.alert('Cast', error);
    }
  }, [error]);

  React.useEffect(() => {
    if (isCasting && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  }, [isCasting]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Cast Video' }} />
      <StatusBar style="auto" />
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: params.videoUrl as string }}
          style={styles.videoPlayer}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay={!isCasting}
          accessibilityLabel="Lecteur vidéo"
        />
        <CastButton
          accessibilityLabel="Ouvrir la boîte de dialogue Cast"
          importantForAccessibility="yes"
          style={[
            styles.castIcon,
            I18nManager.isRTL ? styles.castIconRtl : styles.castIconLtr,
          ]}
        />
      </View>
      <View style={styles.castControlsContainer}>
        <Text style={styles.castStatus}>
          {castState === CastState.NOT_CONNECTED && 'Non connecté'}
          {castState === CastState.CONNECTING && 'Connexion en cours...'}
          {castState === CastState.CONNECTED && !isCasting && 'Connecté'}
          {castState === CastState.CONNECTED && isCasting && 'Casting en cours'}
        </Text>
        {isLoading && <ActivityIndicator size="large" color="#0066cc" accessibilityLabel="Chargement cast" />}
        {!isLoading && (
          <View style={styles.buttonContainer}>
            {!isCasting ? (
              <TouchableOpacity
                style={styles.castButton}
                onPress={startCasting}
                accessibilityRole="button"
                accessibilityLabel="Démarrer casting Chromecast"
              >
                <Ionicons name={"cast" as any} size={24} color="white" />
                <Text style={styles.buttonText}>Démarrer le Cast</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.castButton, styles.stopButton]}
                onPress={stopCasting}
                accessibilityRole="button"
                accessibilityLabel="Arrêter casting Chromecast"
              >
                <Ionicons name="stop-circle" size={24} color="white" />
                <Text style={styles.buttonText}>Arrêter le Cast</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f10' },
  videoContainer: { flex: 1 },
  videoPlayer: { flex: 1 },
  castControlsContainer: {
    padding: 20,
    alignItems: 'center',
    minHeight: 190,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: -8,
  },
  castStatus: { fontSize: 15, marginBottom: 18, textAlign: 'center', color: Colors.darkColor, fontWeight: '600' },
  buttonContainer: { width: '100%', alignItems: 'center' },
  castButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginBottom: 14,
    width: '82%',
    minHeight: 48,
  },
  stopButton: { backgroundColor: '#DB4437' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  castIcon: {
    position: 'absolute',
    top: 16,
    width: 40,
    height: 40,
    tintColor: 'white',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 8,
  },
  castIconRtl: {
    left: 16,
  },
  castIconLtr: {
    right: 16,
  },
});
