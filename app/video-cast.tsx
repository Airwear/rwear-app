import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, I18nManager } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CastButton, CastState } from 'react-native-google-cast';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useCasting } from '../hooks/useCasting';

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
      <View style={{ flex: 1 }}>
        <Video
          ref={videoRef}
          source={{ uri: params.videoUrl as string }}
          style={{ flex: 1 }}
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
            I18nManager.isRTL ? { left: 16, right: undefined } : { right: 16 },
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
                <Ionicons name="cast" size={24} color="white" />
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
  container: { flex: 1, backgroundColor: '#fff' },
  castControlsContainer: { padding: 20, alignItems: 'center', minHeight: 180 },
  castStatus: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  buttonContainer: { width: '100%', alignItems: 'center' },
  castButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginBottom: 16,
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
    tintColor: 'white'
  }
});
