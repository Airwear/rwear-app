import { useEvent, useEventListener  } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { VideoRawType } from '@/utils/type-def';
import Loader from '@/components/Loader';
import * as ScreenOrientation from 'expo-screen-orientation';
import { CastButton, CastContext } from 'react-native-google-cast';

export default function Player1(video: VideoRawType) {

  const router = useRouter();
  
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

  return (
    <View style={styles.screenContainer}>
      {/* Cast Button - Fixed overlay OUTSIDE the video container */}
      <View style={styles.castButtonWrapper}>
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
        <View style={styles.controlsContainer}>
          <Button
            title="Retour"
            onPress={handleBackPress}
            color="#007AFF"
          />
        </View>
      </View>
    </View>
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
    width: 350,
    height: 275,
  },

  castButtonWrapper: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 28,
    zIndex: 999999,
    elevation: 100, // For Android - ensures it's on top
    pointerEvents: 'box-none', // Allow clicks to pass through
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
