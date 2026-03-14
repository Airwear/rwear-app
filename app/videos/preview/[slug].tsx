import { ButtonSimple } from '@/components/buttons';
import Colors from '@/constants/Colors';
import { _get, apiRoutes } from '@/services/api';
import { VideoRawType } from '@/utils/type-def';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VideoPreviewScreen() {
  const navigation = useNavigation();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<VideoRawType | null>(null);
  const controller = useMemo(() => new AbortController(), []);

  const fetchVideo = async () => {
    if (!slug) return;
    setLoading(true);
    const url = `${apiRoutes.trainings}/${slug}`;

    _get(url, controller, {})
      .then((response) => setVideo(response?.data ?? null))
      .catch(() => setVideo(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    navigation.setOptions({ title: 'Aperçu vidéo' });
    fetchVideo();

    return () => controller.abort();
  }, [slug]);

  const onStartVideo = () => {
    if (!slug) return;
    router.push({ pathname: '/videos/play/[slug]', params: { slug } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {!!video?.cover && <Image source={{ uri: video.cover }} style={styles.cover} />}

        <View style={styles.card}>
          <Text style={styles.title}>{video?.designation ?? 'Vidéo'}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.meta}>Durée : {video?.duration_in_text ?? '-'}</Text>
            <Text style={styles.meta}>Niveau : {video?.level_name ?? '-'}</Text>
          </View>

          <Text style={styles.description}>
            {video?.description || "Aucune description disponible pour cette vidéo."}
          </Text>

          <View style={styles.actionWrap}>
            <ButtonSimple
              text={loading ? 'Chargement...' : 'Lancer la vidéo'}
              color={Colors.primary}
              onPress={onStartVideo}
              disabled={loading || !video}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: 14,
    paddingBottom: 28,
  },
  cover: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#d1d5db',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eceef2',
    backgroundColor: '#ffffff',
    padding: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.darkColor,
    marginBottom: 10,
  },
  metaRow: {
    gap: 6,
    marginBottom: 12,
  },
  meta: {
    fontSize: 13,
    color: Colors.muted,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: Colors.darkColor,
    lineHeight: 20,
  },
  actionWrap: {
    marginTop: 16,
  },
});
