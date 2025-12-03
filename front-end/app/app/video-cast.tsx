import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import GoogleCast, { CastButton, CastState, SessionManager } from 'react-native-google-cast';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function VideoCastScreen() {
  const params = useLocalSearchParams();

  // Work around mismatched/ambiguous typings from the google cast lib
  const GC: any = GoogleCast as any;
  const GoogleCastButton: any = CastButton as any;
  const [castState, setCastState] = useState(CastState.NOT_CONNECTED);
  const [sessionManager, setSessionManager] = useState<SessionManager | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCasting, setIsCasting] = useState(false);

  useEffect(() => {
    // Forcer le mode paysage
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      // Revenir en portrait à la sortie
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  useEffect(() => {
    const initCast = async () => {
      try {
        await GC.setCastOptions({
          receiverApplicationId: GC.RECEIVER_ID_CAST_VIDEOS,
        });

        const castStateListener = GC.onCastStateChanged((state: any) => {
          setCastState(state);
        });

        const manager = await GC.getSessionManager();
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
        await GC.showCastDialog();
      }
      const videoUrl = typeof params.videoUrl === 'string' ? params.videoUrl : (Array.isArray(params.videoUrl) ? params.videoUrl[0] : String(params.videoUrl));
      // Détection du type de contenu
      const u = (videoUrl || '').toLowerCase();
      const isHls = u.endsWith('.m3u8') || u.includes('m3u8');
      const isDash = u.endsWith('.mpd') || u.includes('manifest.mpd') || u.includes('/dash');
      const isMp4 = u.endsWith('.mp4') || u.includes('.mp4');
      const contentType = isHls
        ? 'application/x-mpegURL'
        : isDash
          ? 'application/dash+xml'
          : isMp4
            ? 'video/mp4'
            : 'video/mp4';
      await sessionManager.loadMedia({
        mediaInfo: {
          contentId: videoUrl,
          contentType,
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
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Stack.Screen options={{ 
        title: 'Cast Video',
        headerShown: false,
      }} />
      <StatusBar hidden />

      {/* Lecteur vidéo en plein écran */}
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: typeof params.videoUrl === 'string' ? params.videoUrl : (Array.isArray(params.videoUrl) ? params.videoUrl[0] : String(params.videoUrl)) }}
          style={styles.video}
          resizeMode={"contain" as any}
          useNativeControls
        />
        
        {/* Bouton Cast fixe en haut à droite avec z-index élevé */}
        <View style={styles.castButtonWrapper}>
          <GoogleCastButton
            style={styles.castButtonStyle as any}
          />
        </View>
      </View>

      {/* Zone de contrôle Cast (masquée en plein écran, apparaît seulement si nécessaire) */}
      {(castState !== CastState.CONNECTED || !isCasting) && (
      <View style={styles.castControlsContainer}>
        <Text style={styles.castStatus}>
          {castState === CastState.NOT_CONNECTED && 'Non connecté'}
          {castState === CastState.CONNECTING && 'Connexion en cours...'}
          {(castState as any) === (CastState.CONNECTED as any) && !isCasting && 'Connecté'}
          {(castState as any) === (CastState.CONNECTED as any) && isCasting && 'Casting en cours'}
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.buttonContainer}>
            {!isCasting ? (
              <TouchableOpacity style={styles.castButton} onPress={startCasting}>
                <Ionicons name={"cast" as any} size={24} color="white" />
                <Text style={styles.buttonText}>Démarrer le Cast</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.castButton, styles.stopButton]} onPress={stopCasting}>
                <Ionicons name={"stop-circle" as any} size={24} color="white" />
                <Text style={styles.buttonText}>Arrêter le Cast</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      )}
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  castButtonWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 9999,
    elevation: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  castButtonStyle: {
    width: 32,
    height: 32,
    tintColor: 'white',
  },
  castControlsContainer: { 
    padding: 20, 
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  castStatus: { fontSize: 14, marginBottom: 10, textAlign: 'center', color: '#fff' },
  buttonContainer: { width: '100%', alignItems: 'center' },
  castButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
  },
  stopButton: { backgroundColor: '#DB4437' },
  buttonText: { color: 'white', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
});