import { useEvent, useEventListener  } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { VideoRawType } from '@/utils/type-def';
import Loader from '@/components/Loader';
import * as ScreenOrientation from 'expo-screen-orientation';
import { CastButton } from 'react-native-google-cast';

export default function Player1(video: VideoRawType) {

  const player = useVideoPlayer(video.url, player => {
    player.loop = true;
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

  if(status !== READY_TO_PLAY) {
    return <Loader visible />
  }

  return (
    <View style={styles.contentContainer}>
      <VideoView 
        style={styles.video} 
        player={player} 
        allowsFullscreen 
        allowsPictureInPicture
        //@ts-ignore
        ref={videoViewRef} 
       />
      <CastButton
        style={styles.castButton}
        tintColor="white"
      />
      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

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

  castButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    tintColor: 'white',
    zIndex: 9999,
  },

  controlsContainer: {
    padding: 10,
  },
  
});
