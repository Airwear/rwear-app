import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler, TouchableOpacity, ActivityIndicator, Text, I18nManager } from 'react-native';
import Video from 'react-native-video';
import GoogleCast, { CastButton, CastMiniController, CastState } from 'react-native-google-cast';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';   // 🔹 Ajout
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

export default function VideoPlayer({ route, navigation }: Props) {
  const { videoUrl } = route.params;
  const playerRef = useRef<Video>(null);
  const [castConnected, setCastConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [casting, setCasting] = useState(false);
  const [paused, setPaused] = useState(false);

  // 🔹 Gestion du bouton retour Android
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

  // 🔹 Gestion du Cast
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

  const startCasting = async () => {
    if (!videoUrl || typeof videoUrl !== 'string' || !/^https?:\/\//.test(videoUrl)) {
      setError('URL vidéo invalide');
      return;
    }
    try {
      setCasting(true);
      GoogleCast.castMedia({
        mediaUrl: videoUrl,
        title: 'Lecture en Cast',
        subtitle: 'Depuis Rwear',
        contentType: 'video/mp4',
        streamType: 'BUFFERED'
      });
    } catch (e) {
      setError('Erreur Cast');
      setCasting(false);
    }
  };

  // 🔹 Forcer paysage à l’arrivée sur l’écran
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      // 🔹 Revenir en portrait quand on quitte
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={playerRef}
        source={{ uri: videoUrl }}
        style={styles.video}
        controls
        resizeMode="contain"
        paused={paused}
        onLoadStart={() => setLoading(true)}
        onLoad={() => { setLoading(false); setPaused(false); }}
        onError={() => { setError('Erreur lecture'); setLoading(false); }}
        onSeek={() => setPaused(false)}
        playInBackground={false}
        playWhenInactive={false}
        progressUpdateInterval={250}
      />
      {loading && <View style={styles.loader}><ActivityIndicator color="#fff" size="large" /></View>}
      {error && <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View>}
      <View style={styles.overlayButtons}>
        <CastButton accessibilityLabel="Ouvrir Cast" style={styles.castButton} />
        {!casting && (
          <TouchableOpacity style={styles.actionBtn} onPress={startCasting} accessibilityLabel="Démarrer le cast">
            <Text style={styles.actionText}>Caster</Text>
          </TouchableOpacity>
        )}
      </View>
      {castConnected && (
        <CastMiniController style={styles.miniController} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  video: { 
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlayButtons: { position: 'absolute', top: 14, right: 14, flexDirection: 'row', gap: 10, alignItems: 'center' },
  castButton: { width: 30, height: 30, tintColor: 'white' },
  actionBtn: { backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  actionText: { color: '#fff', fontWeight: '600' },
  miniController: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#222', zIndex: 100 },
  loader: { position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center' },
  errorBanner: { position: 'absolute', bottom: 70, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(255,0,0,0.7)' },
  errorText: { color: '#fff', textAlign: 'center', fontWeight: '600' }
});