import { useCallback, useEffect, useMemo, useState } from 'react';
import { Professional } from '@/src/features/services/types';
import { servicesService } from '@/src/features/services/services/servicesService';
import { useFavoriteProfessionalIds } from '@/src/features/services/stores/servicesFavoritesStore';

export function useProfessionalDetails(id: string) {
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const favoriteIds = useFavoriteProfessionalIds();

  const load = useCallback(async () => {
    if (!id) {
      setProfessional(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const entry = await servicesService.getProfessionalById(id);

      setProfessional(entry);

      if (!entry) {
        setError('Professionnel introuvable.');
      }
    } catch {
      setError('Impossible de charger ce profil pour le moment.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const toggleFavorite = useCallback(async () => {
    if (!professional) {
      return;
    }

    await servicesService.toggleFavorite(professional.id);
  }, [professional]);

  const isFavorite = useMemo(() => {
    if (!professional) {
      return false;
    }

    return favoriteIds.includes(professional.id);
  }, [favoriteIds, professional]);

  return {
    professional,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    reload: load,
  };
}
