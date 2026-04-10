import { ButtonSimple } from '@/components/buttons';
import Colors from '@/constants/Colors';
import { _get, apiRoutes } from '@/services/api';
import { VideoRawType } from '@/utils/type-def';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VideoPreviewScreen() {
  const navigation = useNavigation();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<VideoRawType | null>(null);
  const controller = useMemo(() => new AbortController(), []);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const pageBg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;

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
    <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        {!!video?.cover && <Image source={{ uri: video.cover }} style={[styles.cover, { backgroundColor: isDark ? '#1B2026' : '#d1d5db' }]} />}

        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}> 
          <Text style={[styles.title, { color: text }]}>{video?.designation ?? 'Video'}</Text>

          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: muted }]}>Duree : {video?.duration_in_text ?? '-'}</Text>
            <Text style={[styles.meta, { color: muted }]}>Niveau : {video?.level_name ?? '-'}</Text>
          </View>

          <Text style={[styles.description, { color: text }]}>
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
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#111111',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  metaRow: {
    gap: 6,
    marginBottom: 12,
  },
  meta: {
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionWrap: {
    marginTop: 16,
  },
});
