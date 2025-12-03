import { useCallback } from 'react';
import { 
  useCastState, 
  useRemoteMediaClient,
  CastState,
} from 'react-native-google-cast';

export const useCastVideo = () => {
  const castState = useCastState();
  const client = useRemoteMediaClient();
  
  const isConnected = castState === CastState.CONNECTED;

  const castVideo = useCallback(async (
    videoUrl: string,
    title: string,
    subtitle: string,
    imageUrl: string
  ) => {
    if (!client) {
      console.warn('Cast client not available');
      return;
    }

    try {
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

      await client.loadMedia({
        autoplay: true,
        mediaInfo: {
          contentUrl: videoUrl,
          contentType,
          metadata: {
            type: 'generic',
            title,
            subtitle,
            images: imageUrl ? [{ url: imageUrl }] : [],
          },
        },
      });
      console.log('Casting started successfully');
    } catch (error) {
      console.error('Error casting video:', error);
    }
  }, [client]);

  const stopCasting = useCallback(async () => {
    if (!client) {
      console.warn('Cast client not available');
      return;
    }

    try {
      await client.stop();
      console.log('Casting stopped');
    } catch (error) {
      console.error('Error stopping cast:', error);
    }
  }, [client]);

  return {
    castState,
    isConnected,
    castVideo,
    stopCasting,
    client,
  };
};
