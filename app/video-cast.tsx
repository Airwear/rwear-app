import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import GoogleCast, { CastButton, CastState, SessionManager } from 'react-native-google-cast';
import { Video } from '../navigation';
import { Ionicons } from '@expo/vector-icons';

export default function VideoCastScreen() {
  const params = useLocalSearchParams<{
    videoId: string;
    videoUrl: string;
    title: string;
    thumbnail?: string;
  }>();

  const [castState, setCastState] = useState<CastState>(CastState.NOT_CONNECTED);
  const [sessionManager, setSessionManager] = useState<SessionManager | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [castDevices, setCastDevices] = useState<any[]>([]);

  useEffect(() => {
    // Initialize Google Cast
    const initCast = async () => {
      try {
        // Set up the receiver ID for your Cast application
        await GoogleCast.setCastOptions({
          receiverApplicationId: GoogleCast.RECEIVER_ID_CAST_VIDEOS,
          // You can also use your own receiver app ID if you have one
          // receiverApplicationId: 'YOUR_RECEIVER_APP_ID',
        });

        // Listen for cast state changes
        const castStateListener = GoogleCast.onCastStateChanged((state) => {
          console.log('Cast state changed:', state);
          setCastState(state);
        });

        // Get the session manager
        const manager = await GoogleCast.getSessionManager();
        setSessionManager(manager);

        // Listen for session starting
        const sessionStartListener = manager.onSessionStarting(() => {
          console.log('Session starting');
          setIsLoading(true);
        });

        // Listen for session started
        const sessionStartedListener = manager.onSessionStarted(() => {
          console.log('Session started');
          setIsLoading(false);
          setIsCasting(true);
        });

        // Listen for session ending
        const sessionEndingListener = manager.onSessionEnding(() => {
          console.log('Session ending');
        });

        // Listen for session ended
        const sessionEndedListener = manager.onSessionEnded(() => {
          console.log('Session ended');
          setIsCasting(false);
        });

        // Clean up listeners on unmount
        return () => {
          castStateListener.remove();
          sessionStartListener.remove();
          sessionStartedListener.remove();
          sessionEndingListener.remove();
          sessionEndedListener.remove();
        };
      } catch (error) {
        console.error('Error initializing Google Cast:', error);
        Alert.alert('Cast Error', 'Failed to initialize casting. Please try again.');
      }
    };

    initCast();
  }, []);

  // Function to start casting
  const startCasting = async () => {
    if (!sessionManager) {
      Alert.alert('Cast Error', 'Cast not initialized. Please try again.');
      return;
    }

    try {
      setIsLoading(true);

      // Check if we're already connected to a device
      if (castState !== CastState.CONNECTED) {
        // Show the device selection dialog
        await GoogleCast.showCastDialog();
      }

      // Load media to cast
      await sessionManager.loadMedia({
        mediaInfo: {
          contentId: params.videoUrl,
          contentType: 'video/mp4', // Adjust based on your video format
          metadata: {
            type: 'movie', // or 'tvShow', 'musicTrack', etc.
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
      Alert.alert('Cast Error', 'Failed to start casting. Please try again.');
    }
  };

  // Function to stop casting
  const stopCasting = async () => {
    if (!sessionManager) return;

    try {
      await sessionManager.endCurrentSession();
      setIsCasting(false);
    } catch (error) {
      console.error('Error stopping cast:', error);
    }
  };

  // Function to show available cast devices
  const showCastDevices = async () => {
    router.push('/cast-devices');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Cast Video',
          headerRight: () => <CastButton style={{ width: 24, height: 24, tintColor: '#000' }} />,
        }}
      />
      <StatusBar style="auto" />

      <View style={styles.videoInfoContainer}>
        {params.thumbnail && (
          <Image source={{ uri: params.thumbnail }} style={styles.thumbnail} />
        )}
        <Text style={styles.title}>{params.title}</Text>
      </View>

      <View style={styles.castControlsContainer}>
        <Text style={styles.castStatus}>
          {castState === CastState.NOT_CONNECTED && 'Not connected to any device'}
          {castState === CastState.CONNECTING && 'Connecting to cast device...'}
          {castState === CastState.CONNECTED && !isCasting && 'Connected to cast device'}
          {castState === CastState.CONNECTED && isCasting && 'Casting to device'}
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.buttonContainer}>
            {!isCasting ? (
              <TouchableOpacity style={styles.castButton} onPress={startCasting}>
                <Ionicons name="cast" size={24} color="white" />
                <Text style={styles.buttonText}>Start Casting</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.castButton, styles.stopButton]} onPress={stopCasting}>
                <Ionicons name="stop-circle" size={24} color="white" />
                <Text style={styles.buttonText}>Stop Casting</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.deviceButton} onPress={showCastDevices}>
              <Ionicons name="tv" size={24} color="white" />
              <Text style={styles.buttonText}>Cast Devices</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoInfoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  castControlsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  castStatus: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  castButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4', // Google blue
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
  },
  stopButton: {
    backgroundColor: '#DB4437', // Google red
  },
  deviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F9D58', // Google green
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
