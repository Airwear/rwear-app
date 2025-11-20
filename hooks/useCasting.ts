import { useEffect, useState, useCallback } from 'react';
import GoogleCast, { CastState, SessionManager } from 'react-native-google-cast';

export interface CastingMetadata {
  title?: string;
  thumbnail?: string;
}

interface UseCastingResult {
  castState: CastState;
  isCasting: boolean;
  isLoading: boolean;
  error?: string;
  startCasting: () => Promise<void>;
  stopCasting: () => Promise<void>;
}

// Hook unifié pour la gestion du casting Chromecast avec gestion d'état et nettoyage.
export function useCasting(videoUrl?: string, metadata: CastingMetadata = {}): UseCastingResult {
  const [castState, setCastState] = useState<CastState>(CastState.NOT_CONNECTED);
  const [sessionManager, setSessionManager] = useState<SessionManager | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Initialisation des listeners Cast.
  useEffect(() => {
    let castStateListener: { remove: () => void } | undefined;
    let sessionStartedListener: { remove: () => void } | undefined;
    let sessionEndedListener: { remove: () => void } | undefined;

    const init = async () => {
      try {
        await GoogleCast.setCastOptions({ receiverApplicationId: GoogleCast.RECEIVER_ID_CAST_VIDEOS });
        castStateListener = GoogleCast.onCastStateChanged((state) => setCastState(state));
        const manager = await GoogleCast.getSessionManager();
        setSessionManager(manager);
        sessionStartedListener = manager.onSessionStarted(() => {
          setIsLoading(false);
          setIsCasting(true);
        });
        sessionEndedListener = manager.onSessionEnded(() => {
          setIsCasting(false);
        });
      } catch (e) {
        setError('Erreur initialisation Cast');
      }
    };
    init();
    return () => {
      castStateListener?.remove();
      sessionStartedListener?.remove();
      sessionEndedListener?.remove();
    };
  }, []);

  const startCasting = useCallback(async () => {
    if (!sessionManager) return;
    if (!videoUrl || typeof videoUrl !== 'string' || !/^https?:\/\//.test(videoUrl)) {
      setError('URL vidéo invalide');
      return;
    }
    try {
      setIsLoading(true);
      if (castState !== CastState.CONNECTED) {
        await GoogleCast.showCastDialog();
      }
      await sessionManager.loadMedia({
        mediaInfo: {
          contentId: videoUrl,
          contentType: 'video/mp4',
          metadata: {
            type: 'movie',
            title: metadata.title || 'Lecture vidéo',
            images: metadata.thumbnail ? [{ url: metadata.thumbnail }] : [],
          },
        },
      });
      setIsLoading(false);
      setIsCasting(true);
    } catch (e) {
      setIsLoading(false);
      setError('Erreur démarrage Cast');
    }
  }, [sessionManager, videoUrl, metadata.title, metadata.thumbnail, castState]);

  const stopCasting = useCallback(async () => {
    if (!sessionManager) return;
    try {
      await sessionManager.endCurrentSession();
      setIsCasting(false);
    } catch (e) {
      setError('Erreur arrêt Cast');
    }
  }, [sessionManager]);

  return { castState, isCasting, isLoading, error, startCasting, stopCasting };
}
