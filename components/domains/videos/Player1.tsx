import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { ActivityIndicator, Button, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { VideoRawType } from '@/utils/type-def';
import { CastButton, CastContext } from 'react-native-google-cast';
import { resolvedBaseURL } from '@/services/api';
import { useAuth } from '@/contexts/authContext';

const getContentType = (url?: string) => {
  const value = (url || '').toLowerCase();

  if (value.endsWith('.m3u8') || value.includes('m3u8')) {
    return 'application/x-mpegURL';
  }

  if (value.endsWith('.mpd') || value.includes('manifest.mpd') || value.includes('/dash')) {
    return 'application/dash+xml';
  }

  return 'video/mp4';
};

export default function Player1(video: VideoRawType) {
  const router = useRouter();
  const { authData } = useAuth();
  const dimensions = useWindowDimensions();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(dimensions.width > dimensions.height ? 'landscape' : 'portrait');
  const [status, setStatus] = useState<string>('loading');
  const [playerError, setPlayerError] = useState<string | null>(null);

  const baseWebUrl = useMemo(() => resolvedBaseURL.replace(/\/api\/?$/, ''), []);
  const token = (authData as any)?.token || (authData as any)?.access_token || (authData as any)?.jwt || (authData as any)?.bearer || (authData as any)?.user?.token;

  const normalizedUrl = useMemo(() => {
    const raw = (video.url || '').trim();

    if (!raw) {
      return '';
    }

    const absolute = /^https?:\/\//i.test(raw)
      ? raw
      : `${baseWebUrl}${raw.startsWith('/') ? '' : '/'}${raw}`;

    return encodeURI(absolute);
  }, [baseWebUrl, video.url]);

  const coverImageUrl = useMemo(() => {
    const raw = (video.cover || '').trim();

    if (!raw) {
      return '';
    }

    const absolute = /^https?:\/\//i.test(raw)
      ? raw
      : `${baseWebUrl}${raw.startsWith('/') ? '' : '/'}${raw}`;

    return encodeURI(absolute);
  }, [baseWebUrl, video.cover]);

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

  const player = useVideoPlayer(normalizedUrl ? { uri: normalizedUrl, headers: requestHeaders } : null, instance => {
    instance.loop = false;
    instance.currentTime = 0;
    instance.play();
    instance.timeUpdateEventInterval = 0.5;
    instance.showNowPlayingNotification = true;
  });

  useEventListener(player, 'statusChange', ({ status, error }) => {
    setStatus(status);

    if (error) {
      const rawMessage = typeof error === 'string' ? error : (error as any)?.message || 'Impossible de lire cette vidéo.';
      setPlayerError(rawMessage.includes('403') ? 'Accès refusé à la source vidéo. Nouvelle requête sécurisée appliquée.' : rawMessage);
      return;
    }

    if (status === 'readyToPlay') {
      setPlayerError(null);
    }
  });

  useEffect(() => {
    const isLandscape = dimensions.width > dimensions.height;
    setOrientation(isLandscape ? 'landscape' : 'portrait');
  }, [dimensions.width, dimensions.height]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        try {
          player.pause();
        } catch {
          // Keep navigation stable even if player cleanup fails.
        }
      };
    }, [player])
  );

  const handleBackPress = useCallback(() => {
    try {
      player.pause();
    } catch {
      // No-op.
    }

    router.back();
  }, [player, router]);

  useEffect(() => {
    if (!normalizedUrl) {
      return;
    }

    try {
      CastContext.setSharedMediaInfo({
        mediaInfo: {
          contentId: normalizedUrl,
          contentType: getContentType(normalizedUrl),
          streamType: 'BUFFERED',
          metadata: {
            type: 0,
            metadataType: 0,
            title: video.designation || 'Video',
            subtitle: video.category_name || 'AIRWEAR',
            images: coverImageUrl ? [{ url: coverImageUrl }] : [],
          },
          customData: {
            autoPlay: true,
            authToken: token,
            requestHeaders,
            preloadedContent: {
              mediaUrl: normalizedUrl,
            },
          },
        },
      });
    } catch {
      // Keep playback functional if cast metadata cannot be prepared.
    }
  }, [normalizedUrl, requestHeaders, token, video.designation, video.category_name, coverImageUrl]);

  const castButtonStyle = orientation === 'landscape' ? styles.castButtonLandscape : styles.castButtonPortrait;
  const showLoader = !playerError && status !== 'readyToPlay';

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={[styles.castButtonWrapper, castButtonStyle]} pointerEvents="box-none">
        <CastButton style={styles.castButton} tintColor="white" />
      </View>

      <View style={styles.contentContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          nativeControls={true}
          contentFit="contain"
        />

        {showLoader && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        {!!playerError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{playerError}</Text>
          </View>
        )}

        <View style={styles.controlsContainer}>
          <Button title="Retour" onPress={handleBackPress} color="#007AFF" />
        </View>
      </View>
    </SafeAreaView>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },

  video: {
    width: '100%',
    height: '100%',
  },

  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },

  errorBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 78,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(160, 18, 18, 0.88)',
  },

  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },

  castButtonWrapper: {
    position: 'absolute',
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 28,
    zIndex: 9999,
    elevation: 1000,
  },

  castButtonPortrait: {
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  castButtonLandscape: {
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  castButton: {
    width: 48,
    height: 48,
    tintColor: 'white',
    pointerEvents: 'auto',
  },

  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
});
