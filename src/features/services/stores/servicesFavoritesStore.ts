import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';
import { FavoriteProfessional } from '@/src/features/services/types';

const FAVORITES_KEY = '@servicesFavorites';

type Listener = () => void;

let favoriteIds: string[] = [];
let hydrated = false;
let hydrationPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export async function hydrateFavorites(): Promise<void> {
  if (hydrated) {
    return;
  }

  if (!hydrationPromise) {
    hydrationPromise = AsyncStorage.getItem(FAVORITES_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as FavoriteProfessional[];
          favoriteIds = parsed.map((entry) => entry.professionalId);
        } else {
          favoriteIds = [];
        }
      })
      .catch(() => {
        favoriteIds = [];
      })
      .finally(() => {
        hydrated = true;
        hydrationPromise = null;
        notify();
      });
  }

  await hydrationPromise;
}

export function subscribeToFavorites(listener: Listener) {
  listeners.add(listener);
  void hydrateFavorites();
  return () => {
    listeners.delete(listener);
  };
}

export function getFavoriteIdsSnapshot(): string[] {
  return favoriteIds;
}

export function isFavoriteProfessional(id: string): boolean {
  return favoriteIds.includes(id);
}

export async function toggleFavoriteProfessional(id: string): Promise<string[]> {
  await hydrateFavorites();

  const exists = favoriteIds.includes(id);
  const nextIds = exists ? favoriteIds.filter((entry) => entry !== id) : [...favoriteIds, id];

  favoriteIds = nextIds;
  const payload: FavoriteProfessional[] = nextIds.map((professionalId) => ({
    professionalId,
    favoritedAt: new Date().toISOString(),
  }));

  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(payload));
  } catch {
    // Keep local sync even if persistence fails.
  }

  notify();
  return nextIds;
}

export function useFavoriteProfessionalIds(): string[] {
  const ids = useSyncExternalStore(subscribeToFavorites, getFavoriteIdsSnapshot, getFavoriteIdsSnapshot);

  useEffect(() => {
    void hydrateFavorites();
  }, []);

  return ids;
}
