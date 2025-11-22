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
    if (!videoUrl || typeof videoUrl !== 'string') {
      setError('URL vidéo manquante');
      return;
    }
    if (!/^https?:\/\//.test(videoUrl)) {
      setError('URL doit être publique (http/https)');
      return;
    }
    try {
      setIsLoading(true);
      setError(undefined);
      console.log('🎬 Démarrage Cast avec URL:', videoUrl);
      
      if (castState !== CastState.CONNECTED) {
        console.log('📡 Ouverture dialogue Cast...');
        const shown = await GoogleCast.showCastDialog();
        if (!shown) {
          setIsLoading(false);
          setError('Dialogue Cast annulé');
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const currentSessionManager = await GoogleCast.getSessionManager();
      console.log('📱 SessionManager obtenu, chargement média...');
      
      await currentSessionManager.loadMedia({
        mediaInfo: {
          contentId: videoUrl,
          contentType: 'video/mp4',
          streamType: 'buffered',
          metadata: {
            type: 'movie',
            title: metadata.title || 'Lecture vidéo',
            images: metadata.thumbnail ? [{ url: metadata.thumbnail }] : [],
          },
        },
        startTime: 0,
        autoplay: true,
      });
      
      setIsLoading(false);
      setIsCasting(true);
      console.log('✅ Cast démarré avec succès');
    } catch (e: any) {
      console.error('❌ Erreur Cast:', e);
      setIsLoading(false);
      setError('Erreur: ' + (e?.message || 'Impossible de caster'));
    }
  }, [videoUrl, metadata.title, metadata.thumbnail, castState]);

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
