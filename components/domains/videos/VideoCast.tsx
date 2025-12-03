import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import GoogleCast, { CastButton, CastState, useRemoteMediaClient } from 'react-native-google-cast';
import { Ionicons } from '@expo/vector-icons';
import Loader from "@/components/Loader";

interface VideoType {
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

interface VideoCastProps {
  video: VideoType;
}

export default function VideoCast({ video }: VideoCastProps) {
  const [castState, setCastState] = useState<CastState>(CastState.NOT_CONNECTED);
  const [isCasting, setIsCasting] = useState(false);
  const client = useRemoteMediaClient();
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [ready, isReady] = useState(false);

  useEffect(() => {
    // Initialize Google Cast
    GoogleCast.EventEmitter.addListener(GoogleCast.CAST_STATE_CHANGED, (state) => {
      console.log('Cast state changed:', state);
      setCastState(state.castState);
    });

    // Set up the receiver app ID (default receiver)
    GoogleCast.setCastOptions({
      receiverApplicationId: GoogleCast.RECEIVER_APP_ID,
    });

    return () => {
      GoogleCast.EventEmitter.removeAllListeners();
    };
  }, []);

  const startCasting = async () => {
    if (!client || !video.url) {
      console.error('No client or video URL available');
      return;
    }

    try {
      // If video is playing locally, pause it
      if (videoRef.current) {
        await videoRef.current.pauseAsync();
      }

      // Get current position if video was playing
      let position = 0;
      if (status.isLoaded && status.positionMillis) {
        position = status.positionMillis / 1000; // Convert to seconds
      }

      // Détection du type de contenu
      const u = (video.url || '').toLowerCase();
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

      // Load media to cast
      await client.loadMedia({
        mediaInfo: {
          contentUrl: video.url,
          contentType,
          metadata: {
            title: video.title || 'Video',
            subtitle: video.description || '',
            images: [
              {
                url: video.thumbnail || '',
              },
            ],
          },
        },
        autoplay: true,
        startTime: position, // Start from current position
      });
      
      setIsCasting(true);
      console.log('Started casting successfully');
    } catch (error) {
      console.error('Error starting cast:', error);
    }
  };

  const stopCasting = async () => {
    if (client) {
      try {
        // Get current position from cast
        const mediaStatus = await client.getMediaStatus();
        const position = mediaStatus?.streamPosition || 0;
        
        await client.stop();
        setIsCasting(false);
        
        // Resume local playback from the cast position
        if (videoRef.current && position > 0) {
          await videoRef.current.setPositionAsync(position * 1000); // Convert to milliseconds
          await videoRef.current.playAsync();
        }
        
        console.log('Stopped casting');
      } catch (error) {
        console.error('Error stopping cast:', error);
      }
    }
  };

  const _onReadyForDisplay = (event) => {
    isReady(Boolean(event?.status?.isLoaded));
  };

  const _onPlaybackStatusUpdate = (playbackStatus) => {
    setStatus(playbackStatus);
  };

  return (
    <View style={styles.container}>
      {!ready && !isCasting && <Loader visible />}
      
      {!isCasting && video.url && (
        <Video
          ref={videoRef}
          style={styles.video}
          source={{
            uri: video.url,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onReadyForDisplay={_onReadyForDisplay}
          onPlaybackStatusUpdate={_onPlaybackStatusUpdate}
        />
      )}
      
      {isCasting && (
        <View style={styles.castingContainer}>
          <Text style={styles.castingText}>
            Casting to TV...
          </Text>
          <TouchableOpacity 
            style={styles.stopButton}
            onPress={stopCasting}
          >
            <Text style={styles.stopButtonText}>Stop Casting</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.controlsContainer}>
        <CastButton style={styles.castButton} />
        
        {castState === CastState.CONNECTED && !isCasting && (
          <TouchableOpacity 
            style={styles.castNowButton}
            onPress={startCasting}
          >
            <Ionicons name="tv-outline" size={20} color="white" />
            <Text style={styles.castNowText}>Cast Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  castingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  castingText: {
    fontSize: 18,
    marginBottom: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  castButton: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  castNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  castNowText: {
    color: 'white',
    marginLeft: 5,
  },
  stopButton: {
    backgroundColor: '#DB4437',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  stopButtonText: {
    color: 'white',
  },
});
