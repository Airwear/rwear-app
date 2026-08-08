import { ButtonSimple } from '@/components/buttons';
import { CastButton } from '@/components/domains/videos/CastButton';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/authContext';
import { _get, apiRoutes, resolvedBaseURL } from '@/services/api';
import { VideoRawType } from '@/utils/type-def';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CastContext } from 'react-native-google-cast';

const getAbsoluteMediaUrl = (rawUrl: string | undefined, baseWebUrl: string) => {
  const value = (rawUrl || '').trim();

  if (!value) {
    return '';
  }

  const absolute = /^https?:\/\//i.test(value)
    ? value
    : `${baseWebUrl}${value.startsWith('/') ? '' : '/'}${value}`;

  return encodeURI(absolute);
};

const resolvePreviewUri = (item: VideoRawType | null, baseWebUrl: string) => {
  const cover = getAbsoluteMediaUrl(item?.cover, baseWebUrl);

  if (cover) {
    return cover;
  }

  const mediaUrl = getAbsoluteMediaUrl(item?.url, baseWebUrl);
  if (mediaUrl.toLowerCase().includes('.mp4')) {
    return mediaUrl.replace(/\.mp4(\?.*)?$/i, '.jpeg$1');
  }

  return '';
};

export default function VideoPreviewScreen() {
  const navigation = useNavigation();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState<VideoRawType | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const controller = useMemo(() => new AbortController(), []);
  const { authData } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const pageBg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;
  const baseWebUrl = useMemo(() => resolvedBaseURL.replace(/\/api\/?$/, ''), []);
  const token = (authData as any)?.token || (authData as any)?.access_token || (authData as any)?.jwt || (authData as any)?.bearer || (authData as any)?.user?.token;
  const previewUrl = useMemo(() => getAbsoluteMediaUrl(video?.url, baseWebUrl), [video?.url, baseWebUrl]);
  const previewImage = useMemo(() => resolvePreviewUri(video, baseWebUrl), [video, baseWebUrl]);
  const displayImage = previewImage;

  const requestHeaders = useMemo(() => {
    const headers: Record<string, string> = {
      Accept: '*/*',
      Referer: `${baseWebUrl}/`,
      Origin: baseWebUrl,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }, [baseWebUrl, token]);

  const fetchVideo = async () => {
    if (!slug) {
      setVideo(null);
      return;
    }

    setLoading(true);
    setPreviewError(null);
    const url = `${apiRoutes.trainings}/${slug}`;

    _get(url, controller, {})
      .then((response) => {
        const payload = response?.data ?? response ?? null;
        setVideo(payload);
      })
      .catch(() => {
        setVideo(null);
        setPreviewError('Impossible de charger cette vidéo pour le moment.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    navigation.setOptions({ title: 'Aperçu vidéo' });
    fetchVideo();

    return () => controller.abort();
  }, [slug]);

  useEffect(() => {
    if (!previewUrl) {
      return;
    }

    const value = previewUrl.toLowerCase();
    const contentType = value.endsWith('.m3u8') || value.includes('m3u8')
      ? 'application/x-mpegURL'
      : value.endsWith('.mpd') || value.includes('manifest.mpd') || value.includes('/dash')
        ? 'application/dash+xml'
        : 'video/mp4';

    try {
      CastContext.setSharedMediaInfo({
        mediaInfo: {
          contentId: previewUrl,
          contentType,
          streamType: 'BUFFERED',
          metadata: {
            type: 0,
            metadataType: 0,
            title: video?.designation || 'Video',
            subtitle: video?.category_name || 'AIRWEAR',
            images: previewImage ? [{ url: previewImage }] : [],
          },
          customData: {
            autoPlay: true,
            authToken: token,
            requestHeaders,
            preloadedContent: {
              mediaUrl: previewUrl,
            },
          },
        },
      });
    } catch {
      // Keep screen functional if cast metadata cannot be set.
    }
  }, [previewUrl, previewImage, requestHeaders, token, video?.designation, video?.category_name]);

  const onStartVideo = () => {
    if (!slug) return;
    router.push({ pathname: '/videos/play/[slug]', params: { slug } });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: pageBg }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.mediaCard, { backgroundColor: surface, borderColor: border }]}>
          {displayImage ? (
            <Image source={{ uri: displayImage }} style={[styles.cover, { backgroundColor: isDark ? '#1B2026' : '#d1d5db' }]} />
          ) : (
            <View style={[styles.previewFallback, { backgroundColor: isDark ? '#1B2026' : '#EEF2F6' }]}>
              <Text style={[styles.previewFallbackTitle, { color: text }]}>Aperçu indisponible</Text>
              <Text style={[styles.previewFallbackText, { color: muted }]}>La vidéo peut être lancée directement ci-dessous.</Text>
            </View>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}> 
          <Text style={[styles.title, { color: text }]}>{video?.designation ?? 'Video'}</Text>

          <View style={styles.castRow}>
            <View style={[styles.castWrap, { borderColor: border, backgroundColor: isDark ? '#1B2026' : '#F7F9FC' }]}> 
              <CastButton tintColor={text} />
            </View>
            <Text style={[styles.castLabel, { color: muted }]}>Caster cette video</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: muted }]}>Duree : {video?.duration_in_text ?? '-'}</Text>
            <Text style={[styles.meta, { color: muted }]}>Niveau : {video?.level_name ?? '-'}</Text>
          </View>

          <Text style={[styles.description, { color: text }]}>
            {video?.description || "Aucune description disponible pour cette vidéo."}
          </Text>

          {!!previewError && (
            <Text style={styles.inlineError}>{previewError}</Text>
          )}

          <View style={styles.actionWrap}>
            <ButtonSimple
              text={loading ? 'Chargement...' : 'Lancer la vidéo'}
              color={Colors.primary}
              onPress={onStartVideo}
              disabled={loading || !video?.url}
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
  mediaCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cover: {
    width: '100%',
    height: 220,
  },
  previewFallback: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  previewFallbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  previewFallbackText: {
    fontSize: 13,
    textAlign: 'center',
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
  castRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  castWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  castLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  inlineError: {
    marginTop: 10,
    color: '#D94B4B',
    fontSize: 13,
    fontWeight: '600',
  },
  actionWrap: {
    marginTop: 16,
  },
});
