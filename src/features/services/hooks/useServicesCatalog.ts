import { useCallback, useEffect, useMemo, useState } from 'react';
import { servicesService } from '@/src/features/services/services/servicesService';
import { useFavoriteProfessionalIds } from '@/src/features/services/stores/servicesFavoritesStore';
import {
  Professional,
  ProfessionalSearchFilters,
  ServiceCategory,
  ServiceMode,
  ServiceSpecialty,
} from '@/src/features/services/types';

export type ViewMode = 'list' | 'nearby';

export type CatalogFilterState = {
  query: string;
  categoryId?: string;
  specialtyId?: string;
  mode?: ServiceMode;
  maxDistanceKm?: number;
};

const initialFilters: CatalogFilterState = {
  query: '',
};

export function useServicesCatalog() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [specialties, setSpecialties] = useState<ServiceSpecialty[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filters, setFilters] = useState<CatalogFilterState>(initialFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const favoriteIds = useFavoriteProfessionalIds();

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [nextCategories, nextSpecialties] = await Promise.all([
        servicesService.getCategories(),
        servicesService.getSpecialties(),
      ]);

      setCategories(nextCategories);
      setSpecialties(nextSpecialties);

      const results = await servicesService.searchProfessionals({ query: '' });
      setProfessionals(results);
    } catch {
      setError('Impossible de charger les services pour le moment.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const applyFilters = useCallback(async (nextFilters: CatalogFilterState) => {
    setLoading(true);
    setError('');
    setFilters(nextFilters);

    const payload: ProfessionalSearchFilters = {
      query: nextFilters.query,
      categoryId: nextFilters.categoryId,
      specialtyId: nextFilters.specialtyId,
      mode: nextFilters.mode,
      maxDistanceKm: nextFilters.maxDistanceKm,
    };

    try {
      const results = await servicesService.searchProfessionals(payload);
      setProfessionals(results);
    } catch {
      setError('Erreur lors de la recherche de professionnels.');
    } finally {
      setLoading(false);
    }
  }, []);

  const setQuery = useCallback((query: string) => {
    const nextFilters = { ...filters, query };
    applyFilters(nextFilters).catch(() => {});
  }, [applyFilters, filters]);

  const setCategory = useCallback((categoryId?: string) => {
    const currentSpecialty = filters.specialtyId;
    const specialtyIsCompatible = !categoryId
      || !currentSpecialty
      || specialties.some((item) => item.id === currentSpecialty && item.categoryId === categoryId);

    const nextFilters = {
      ...filters,
      categoryId,
      specialtyId: specialtyIsCompatible ? currentSpecialty : undefined,
    };
    applyFilters(nextFilters).catch(() => {});
  }, [applyFilters, filters, specialties]);

  const toggleFavorite = useCallback(async (professionalId: string) => {
    await servicesService.toggleFavorite(professionalId);
  }, []);

  const categorySpecialties = useMemo(() => {
    if (!filters.categoryId) {
      return specialties;
    }

    return specialties.filter((item) => item.categoryId === filters.categoryId);
  }, [filters.categoryId, specialties]);

  const professionalsByDistance = useMemo(() => {
    return [...professionals].sort((a, b) => a.location.distanceKm - b.location.distanceKm);
  }, [professionals]);

  return {
    categories,
    allSpecialties: specialties,
    specialties: categorySpecialties,
    professionals,
    professionalsByDistance,
    favoriteIds,
    filters,
    viewMode,
    loading,
    error,
    setViewMode,
    applyFilters,
    setQuery,
    setCategory,
    toggleFavorite,
    reload: load,
  };
}
