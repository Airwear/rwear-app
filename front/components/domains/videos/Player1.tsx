import { useEvent, useEventListener  } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { VideoRawType } from '@/utils/type-def';
import Loader from '@/components/Loader';
import * as ScreenOrientation from 'expo-screen-orientation';

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
    console.log('applyLandscape', status)
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }

  async function applyPortrait() {
    console.log('applyPortrait', status)
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
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
    applyLandscape();
    launchFullscreen();
  }, [status, videoViewRef])

  useFocusEffect(
    useCallback(() => {
      // L'écran est monté ou regagné (focus)
      console.log('useFocusEffect: je suis le player 1 useCallback')
      return () => {
        // L'écran est quitté ou perd le focus
        if (player) {

            console.log('useFocusEffect: je sors du player 1', video.url, isPlaying)
            
            if(status === READY_TO_PLAY) {

              console.log('release player on time', player.currentTime)

              applyPortrait();

              player.release();
            }
            
        }
      };
    }, [video, status])
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

  controlsContainer: {
    padding: 10,
  },
  
});
