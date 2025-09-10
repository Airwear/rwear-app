import { useEvent, useEventListener  } from 'expo';
import { TimeUpdateEventPayload, useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button } from 'react-native';

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function ExpoVideo() {
    
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  useEventListener(player, 'timeUpdate', (timeUpdate: TimeUpdateEventPayload) => {
    console.log('Player status changed: ', timeUpdate.currentTime);
  });

  //const events = useEvent(player, 'playingChange', { isPlaying: player.playing });

  //console.log('events', events)
  return (
    <View style={styles.contentContainer}>
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
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
