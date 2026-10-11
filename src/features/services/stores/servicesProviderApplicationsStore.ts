import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';
import {
  ProviderApplicationDraft,
  ProviderApplicationRecord,
  ProviderApplicationState,
  ProviderSupportingDocument,
} from '@/src/features/services/types';

const PROVIDER_APPLICATIONS_KEY = '@servicesProviderApplications.v1';

const EMPTY_STATE: ProviderApplicationState = {
  schemaVersion: 1,
  draft: null,
  applications: [],
};

type Listener = () => void;

let state: ProviderApplicationState = EMPTY_STATE;
let hydrated = false;
let hydrationPromise: Promise<void> | null = null;
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function sanitizeDocument(document: ProviderSupportingDocument): ProviderSupportingDocument {
  return {
    ...document,
    // URI locale temporaire: non persistée pour éviter de traiter un cache éphémère
    // comme un stockage durable de justificatifs.
    localAssetUri: undefined,
  };
}

function sanitizeDraft(draft: ProviderApplicationDraft): ProviderApplicationDraft {
  return {
    ...draft,
    documents: draft.documents.map(sanitizeDocument),
  };
}

function sanitizeApplication(application: ProviderApplicationRecord): ProviderApplicationRecord {
  return {
    ...application,
    documents: application.documents.map(sanitizeDocument),
  };
}

function sanitizeState(nextState: ProviderApplicationState): ProviderApplicationState {
  return {
    schemaVersion: 1,
    draft: nextState.draft ? sanitizeDraft(nextState.draft) : null,
    applications: nextState.applications.map(sanitizeApplication),
  };
}

function normalizeState(raw: unknown): ProviderApplicationState {
  if (!raw || typeof raw !== 'object') {
    return EMPTY_STATE;
  }

  const candidate = raw as Partial<ProviderApplicationState>;
  return {
    schemaVersion: 1,
    draft: candidate.draft || null,
    applications: Array.isArray(candidate.applications) ? candidate.applications : [],
  };
}

async function persistState(nextState: ProviderApplicationState) {
  state = sanitizeState(nextState);

  try {
    await AsyncStorage.setItem(PROVIDER_APPLICATIONS_KEY, JSON.stringify(state));
  } catch {
    // Conserve l'état mémoire même si la persistance échoue.
  }

  notify();
}

export async function hydrateProviderApplicationsState(): Promise<void> {
  if (hydrated) {
    return;
  }

  if (!hydrationPromise) {
    hydrationPromise = AsyncStorage.getItem(PROVIDER_APPLICATIONS_KEY)
      .then((raw) => {
        state = raw ? normalizeState(JSON.parse(raw)) : EMPTY_STATE;
      })
      .catch(() => {
        state = EMPTY_STATE;
      })
      .finally(() => {
        hydrated = true;
        hydrationPromise = null;
        notify();
      });
  }

  await hydrationPromise;
}

export function subscribeToProviderApplications(listener: Listener) {
  listeners.add(listener);
  void hydrateProviderApplicationsState();
  return () => {
    listeners.delete(listener);
  };
}

export function getProviderApplicationsSnapshot(): ProviderApplicationState {
  return state;
}

export function isProviderApplicationsHydrated(): boolean {
  return hydrated;
}

export async function saveProviderApplicationDraft(draft: ProviderApplicationDraft | null): Promise<void> {
  await hydrateProviderApplicationsState();

  await persistState({
    ...state,
    draft,
  });
}

export async function saveProviderApplicationRecord(application: ProviderApplicationRecord): Promise<void> {
  await hydrateProviderApplicationsState();

  await persistState({
    ...state,
    applications: [application, ...state.applications.filter((item) => item.id !== application.id)],
  });
}

export function useProviderApplicationsSnapshot(): ProviderApplicationState {
  const snapshot = useSyncExternalStore(
    subscribeToProviderApplications,
    getProviderApplicationsSnapshot,
    getProviderApplicationsSnapshot,
  );

  useEffect(() => {
    void hydrateProviderApplicationsState();
  }, []);

  return snapshot;
}
