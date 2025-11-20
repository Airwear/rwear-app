import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, I18nManager } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CastButton, CastState } from 'react-native-google-cast';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useCasting } from '../hooks/useCasting';

export default function VideoCastScreen() {
  const params = useLocalSearchParams();
  const { castState, isCasting, isLoading, error, startCasting, stopCasting } = useCasting(
    params.videoUrl as string,
    { title: params.title as string, thumbnail: params.thumbnail as string }
  );

  React.useEffect(() => {
    if (error) {
      Alert.alert('Cast', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Cast Video' }} />
      <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        <Video
          source={{ uri: params.videoUrl as string }}
          style={{ flex: 1 }}
          resizeMode="contain"
          useNativeControls
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
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import GoogleCast, { CastButton, CastState, SessionManager } from 'react-native-google-cast';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

export default function VideoCastScreen() {
  const params = useLocalSearchParams();

  const [castState, setCastState] = useState(CastState.NOT_CONNECTED);
  const [sessionManager, setSessionManager] = useState<SessionManager | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCasting, setIsCasting] = useState(false);

  useEffect(() => {
    const initCast = async () => {
      try {
        await GoogleCast.setCastOptions({
          receiverApplicationId: GoogleCast.RECEIVER_ID_CAST_VIDEOS,
        });

        const castStateListener = GoogleCast.onCastStateChanged((state) => {
          setCastState(state);
        });

        const manager = await GoogleCast.getSessionManager();
        setSessionManager(manager);

        const sessionStartedListener = manager.onSessionStarted(() => {
          setIsLoading(false);
          setIsCasting(true);
        });

        const sessionEndedListener = manager.onSessionEnded(() => {
          setIsCasting(false);
        });

        return () => {
          castStateListener.remove();
          sessionStartedListener.remove();
          sessionEndedListener.remove();
        };
      } catch (error) {
        console.error('Error initializing Google Cast:', error);
        Alert.alert('Cast Error', 'Impossible d’initialiser le Cast.');
      }
    };

    initCast();
  }, []);

  const startCasting = async () => {
    if (!sessionManager) return;
    try {
      setIsLoading(true);
      if (castState !== CastState.CONNECTED) {
        await GoogleCast.showCastDialog();
      }
      await sessionManager.loadMedia({
        mediaInfo: {
          contentId: params.videoUrl,
          contentType: 'video/mp4',
          metadata: {
            type: 'movie',
            title: params.title,
            images: params.thumbnail ? [{ url: params.thumbnail }] : [],
          },
        },
      });
      setIsLoading(false);
      setIsCasting(true);
    } catch (error) {
      console.error('Error starting cast:', error);
      setIsLoading(false);
      Alert.alert('Cast Error', 'Impossible de démarrer le Cast.');
    }
  };

  const stopCasting = async () => {
    if (!sessionManager) return;
    try {
      await sessionManager.endCurrentSession();
      setIsCasting(false);
    } catch (error) {
      console.error('Error stopping cast:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Cast Video' }} />
      <StatusBar style="auto" />

      {/* Lecteur vidéo avec bouton Cast en overlay */}
      <View style={{ flex: 1 }}>
        <Video
          source={{ uri: params.videoUrl }}
          style={{ flex: 1 }}
          resizeMode="contain"
          useNativeControls
        />
        <CastButton
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            tintColor: 'white',
          }}
        />
      </View>

      {/* Zone de contrôle Cast */}
      <View style={styles.castControlsContainer}>
        <Text style={styles.castStatus}>
          {castState === CastState.NOT_CONNECTED && 'Non connecté'}
          {castState === CastState.CONNECTING && 'Connexion en cours...'}
          {castState === CastState.CONNECTED && !isCasting && 'Connecté'}
          {castState === CastState.CONNECTED && isCasting && 'Casting en cours'}
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.buttonContainer}>
            {!isCasting ? (
              <TouchableOpacity style={styles.castButton} onPress={startCasting}>
                <Ionicons name="cast" size={24} color="white" />
                <Text style={styles.buttonText}>Démarrer le Cast</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.castButton, styles.stopButton]} onPress={stopCasting}>
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
  castControlsContainer: { padding: 20, alignItems: 'center' },
  castStatus: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  buttonContainer: { width: '100%', alignItems: 'center' },
  castButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
  },
  stopButton: { backgroundColor: '#DB4437' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});