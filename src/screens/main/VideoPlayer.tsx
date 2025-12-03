import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
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
      // Mettre en pause lecture locale pour éviter double flux
      playerRef.current?.seek(0);
      // Pas de méthode pause sur ref native TypeScript -> rely sur controls (l'utilisateur stoppe) ou utiliser prop paused
      GoogleCast.castMedia({
        mediaUrl: videoUrl,
        title: 'Lecture en Cast',
        subtitle: 'Depuis Rwear',
        contentType,
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
        onError={(e) => { setError('Erreur lecture'); setLoading(false); }}
        onSeek={() => setPaused(false)}
        playInBackground={false}
        playWhenInactive={false}
        progressUpdateInterval={250}
      />
      {loading && (
        <View style={styles.loader}><ActivityIndicator color="#fff" size="large" /></View>
      )}
      {error && (
        <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View>
      )}
      <View style={styles.overlayButtons}>
        <CastButton style={styles.castButton} />
        {!casting && (
          <TouchableOpacity style={styles.actionBtn} onPress={startCasting}>
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
  video: { flex: 1 },
  overlayButtons: { position: 'absolute', top: 16, right: 16, flexDirection: 'row', gap: 12, alignItems: 'center' },
  castButton: { width: 30, height: 30, tintColor: 'white' },
  actionBtn: { backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20 },
  actionText: { color: '#fff', fontWeight: '600' },
  miniController: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#222' },
  loader: { position: 'absolute', top: '50%', left: 0, right: 0, alignItems: 'center' },
  errorBanner: { position: 'absolute', bottom: 70, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(255,0,0,0.7)' },
  errorText: { color: '#fff', textAlign: 'center', fontWeight: '600' }
});