import { useEvent, useEventListener  } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button, useWindowDimensions, SafeAreaView } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { VideoRawType } from '@/utils/type-def';
import Loader from '@/components/Loader';
import * as ScreenOrientation from 'expo-screen-orientation';
import { CastButton, CastContext } from 'react-native-google-cast';

export default function Player1(video: VideoRawType) {

  const router = useRouter();
  const dimensions = useWindowDimensions();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  const player = useVideoPlayer(video.url, player => {
    player.loop = false;
    player.currentTime = 0;
    player.play();
    player.timeUpdateEventInterval = 5;
    player.showNowPlayingNotification = true;
  });

  const [status, setStatus] = useState<string>('loading');
  const [currentTimer, setCurrentTimer] = useState<number>(0);
  let videoViewRef = useRef<any>(null);

  const READY_TO_PLAY = "readyToPlay"

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: false });

  useEventListener(player, 'statusChange', ({ status, error }) => {
    console.log('Player status changed: ', status);
    setStatus(status)
  });

  useEventListener(player, 'timeUpdate', (payload) => {
    setCurrentTimer(payload.currentTime)
    console.log('Player timeUpdate changed: ', payload.currentTime);
  });

  // Détecter changements d'orientation
  useEffect(() => {
    const isLandscape = dimensions.width > dimensions.height;
    const newOrientation = isLandscape ? 'landscape' : 'portrait';
    if (newOrientation !== orientation) {
      setOrientation(newOrientation);
    }
  }, [dimensions.width, dimensions.height, orientation]);

  async function applyLandscape() {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      console.log('Orientation paysage appliquée');
    } catch (err) {
      console.warn('Erreur orientation paysage:', err);
    }
  }

  async function applyPortrait() {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      console.log('Orientation portrait appliquée');
    } catch (err) {
      console.warn('Erreur orientation portrait:', err);
    }
  }

  const launchFullscreen = async () => {

    if(status === READY_TO_PLAY && videoViewRef.current) {
      try {
          console.log('status === READY_TO_PLAY && videoViewRef.current');
          await videoViewRef.current.enterFullscreen();
      } catch (err) {
          console.warn('Erreur lors du passage automatique en plein écran:', err);
      }
    }

  };

  const handleExitFullscreen = useCallback(() => {
    console.log('Exiting fullscreen');
    applyPortrait().catch(err => console.warn('Erreur orientation:', err));
  }, []);

  const handlePlayerError = useCallback((error: any) => {
    console.error('Player error:', error);
  }, []);

  useEffect(() => {
    if (status === READY_TO_PLAY) {
      applyLandscape().catch(err => console.warn('Erreur landscape:', err));
      launchFullscreen();
    }
  }, [status])

  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect: écran vidéo monté')
      return () => {
        console.log('useFocusEffect: nettoyage écran vidéo')
        
        if (player) {
          try {
            player.pause();
            console.log('Player mis en pause');
          } catch (err) {
            console.warn('Erreur pause player:', err);
          }
        }
        
        applyPortrait().catch(err => console.warn('Erreur orientation:', err));
      };
    }, [player])
  );

  const handleBackPress = useCallback(() => {
    if (player) {
      player.pause();
    }
    applyPortrait().catch(err => console.warn('Erreur orientation:', err));
    router.back();
  }, [player, router]);

  // Configure Cast avec l'URL de la vidéo
  useEffect(() => {
    if (video.url) {
      try {
        // Prepare casting metadata with audio configuration
        CastContext.setSharedMediaInfo({
          mediaInfo: {
            contentId: video.url,
            contentType: 'video/mp4',
            streamType: 'BUFFERED',
            metadata: {
              type: 0, // GENERIC
              metadataType: 0,
              title: video.designation || 'Video',
              subtitle: video.category_name || 'AIRWEAR',
              images: video.cover ? [{ url: video.cover }] : [],
            },
            customData: {
              autoPlay: true,
              preloadedContent: {
                mediaUrl: video.url,
              },
            },
            // Ensure audio is included
            tracks: [
              {
                trackId: 1,
                type: 'TEXT',
                subtype: 'SUBTITLE',
                name: 'English',
                language: 'en-US',
              },
            ],
          },
        });
        console.log('Cast config set for:', video.url);
      } catch (err) {
        console.log('Cast config info:', err);
      }
    }
  }, [video.url, video.designation, video.category_name, video.cover]);

  if(status !== READY_TO_PLAY) {
    return <Loader visible />
  }

  const castButtonStyle = orientation === 'landscape' 
    ? styles.castButtonLandscape 
    : styles.castButtonPortrait;

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Cast Button - Fixed overlay OUTSIDE the video container */}
      <View style={[styles.castButtonWrapper, castButtonStyle]} pointerEvents="box-none">
        <CastButton
          style={styles.castButton}
          tintColor="white"
        />
      </View>

      {/* Video Player Container */}
      <View style={styles.contentContainer}>
        <VideoView 
          style={styles.video} 
          player={player} 
          allowsFullscreen 
          allowsPictureInPicture
          nativeControls={true}
          //@ts-ignore
          ref={videoViewRef}
         />
        {orientation === 'portrait' && (
          <View style={styles.controlsContainer}>
            <Button
              title="Retour"
              onPress={handleBackPress}
              color="#007AFF"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  screenContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },

  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },

  video: {
    width: '100%',
    height: '100%',
  },

  castButtonWrapper: {
    position: 'absolute',
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 28,
    zIndex: 9999,
    elevation: 1000, // For Android - ensures it's on top
  },

  castButtonPortrait: {
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  castButtonLandscape: {
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  castButton: {
    width: 48,
    height: 48,
    tintColor: 'white',
    pointerEvents: 'auto',
  },

  controlsContainer: {
    padding: 10,
  },
  
});
