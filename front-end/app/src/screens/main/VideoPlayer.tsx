import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import Video from 'react-native-video';
import GoogleCast, { CastButton, CastMiniController, CastState } from 'react-native-google-cast';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

export default function VideoPlayer({ route, navigation }: Props) {
  const { videoUrl } = route.params;
  const playerRef = useRef<Video>(null);
  const [castConnected, setCastConnected] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  useEffect(() => {
    GoogleCast.getCastState().then(state => {
      setCastConnected(state === CastState.CONNECTED);
    });
    const sessionStarted = GoogleCast.EventEmitter.addListener(
      GoogleCast.SESSION_STARTED,
      () => setCastConnected(true)
    );
    const sessionEnded = GoogleCast.EventEmitter.addListener(
      GoogleCast.SESSION_ENDED,
      () => setCastConnected(false)
    );
    return () => {
      sessionStarted.remove();
      sessionEnded.remove();
    };
  }, []);

  const startCasting = () => {
    GoogleCast.castMedia({
      mediaUrl: videoUrl,
      title: 'Lecture en Cast',
      subtitle: 'Depuis ton app',
      contentType: 'video/mp4'
    });
  };

  return (
    <View style={styles.container}>
      <Video
        ref={playerRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        controls
        resizeMode="contain"
        onPlaybackResume={startCasting}
      />
      <View style={styles.castButtonContainer}>
        <CastButton style={styles.castButton} />
      </View>
      {castConnected && (
        <CastMiniController style={styles.miniController} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  video: { flex: 1 },
  castButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20
  },
  castButton: {
    width: 28,
    height: 28,
    tintColor: 'white'
  },
  miniController: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#222'
  }
});