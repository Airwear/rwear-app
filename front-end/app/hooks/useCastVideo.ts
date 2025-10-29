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
      await client.loadMedia({
        autoplay: true,
        mediaInfo: {
          contentUrl: videoUrl,
          contentType: 'video/mp4',
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
