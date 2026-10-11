import {
  ProviderApplicationDraft,
  ProviderApplicationRecord,
  ProviderApplicationStatus,
  ProviderDocumentKind,
  ProviderDocumentRequirement,
  ProviderSupportingDocument,
  ServiceCategory,
  ServiceSpecialty,
} from '@/src/features/services/types';
import {
  getProviderApplicationsSnapshot,
  hydrateProviderApplicationsState,
  saveProviderApplicationDraft,
  saveProviderApplicationRecord,
} from '@/src/features/services/stores/servicesProviderApplicationsStore';

const APPLICATION_STATUS_LABELS: Record<ProviderApplicationStatus, string> = {
  pending: 'En attente de validation',
};

type RequirementScope = {
  country?: string;
  categoryId?: string;
  specialtyId?: string;
};

function buildRequirementId(prefix: string, key: string): string {
  return `${prefix}:${key}`;
}

export function getProviderDocumentRequirements(scope: RequirementScope): ProviderDocumentRequirement[] {
  const category = scope.categoryId || 'generic';
  const specialty = scope.specialtyId || 'generic';

  const common: ProviderDocumentRequirement[] = [
    {
      id: buildRequirementId('recommended', 'identity-proof'),
      kind: 'other',
      title: 'Pièce d’identification professionnelle (si disponible)',
      bucket: 'recommended',
      description: 'Recommandé pour faciliter l’examen manuel du dossier.',
    },
    {
      id: buildRequirementId('regulatory-to-confirm', 'legal-obligations'),
      kind: 'authorization',
      title: 'Obligations réglementaires à confirmer',
      bucket: 'regulatory_to_confirm',
      description: 'Les obligations légales exactes dépendent du pays et seront confirmées lors de l’intégration back-end.',
    },
  ];

  const byCategory: Record<string, ProviderDocumentRequirement[]> = {
    health: [
      {
        id: buildRequirementId('recommended', 'health-diploma'),
        kind: 'diploma',
        title: 'Diplôme ou certificat de formation en santé',
        bucket: 'recommended',
      },
      {
        id: buildRequirementId('recommended', 'health-training'),
        kind: 'training_attestation',
        title: 'Attestation de formation continue (si applicable)',
        bucket: 'recommended',
      },
    ],
    'sport-wellness': [
      {
        id: buildRequirementId('recommended', 'sport-certification'),
        kind: 'professional_certification',
        title: 'Certification de coaching ou équivalent',
        bucket: 'recommended',
      },
    ],
    beauty: [
      {
        id: buildRequirementId('recommended', 'beauty-certification'),
        kind: 'professional_certification',
        title: 'Certification professionnelle en esthétique (si disponible)',
        bucket: 'recommended',
      },
    ],
  };

  const bySpecialty: Record<string, ProviderDocumentRequirement[]> = {
    'medecin-generaliste': [
      {
        id: buildRequirementId('recommended', 'general-practice-proof'),
        kind: 'professional_certification',
        title: 'Justificatif de pratique en médecine générale (si disponible)',
        bucket: 'recommended',
      },
    ],
    kine: [
      {
        id: buildRequirementId('recommended', 'kine-training-proof'),
        kind: 'training_attestation',
        title: 'Attestation de formation en kinésithérapie (si disponible)',
        bucket: 'recommended',
      },
    ],
    'coaching-sportif': [
      {
        id: buildRequirementId('recommended', 'coach-certification-proof'),
        kind: 'professional_certification',
        title: 'Certification de coaching sportif (si disponible)',
        bucket: 'recommended',
      },
    ],
    'esthetique-visage': [
      {
        id: buildRequirementId('recommended', 'beauty-training-proof'),
        kind: 'training_attestation',
        title: 'Attestation de formation en soins esthétiques (si disponible)',
        bucket: 'recommended',
      },
    ],
    psychologue: [
      {
        id: buildRequirementId('recommended', 'mental-health-training-proof'),
        kind: 'diploma',
        title: 'Diplôme ou formation en accompagnement psychologique (si disponible)',
        bucket: 'recommended',
      },
    ],
    'nutrition-clinique': [
      {
        id: buildRequirementId('recommended', 'nutrition-qualification-proof'),
        kind: 'professional_certification',
        title: 'Qualification en nutrition (si disponible)',
        bucket: 'recommended',
      },
    ],
  };

  const specialized = byCategory[category] || [];
  const specialtySpecific = bySpecialty[specialty] || [];
  return [...common, ...specialized, ...specialtySpecific];
}

export function createEmptyProviderDraft(): ProviderApplicationDraft {
  const now = new Date().toISOString();
  return {
    version: 1,
    startedAt: now,
    updatedAt: now,
    identity: {
      firstName: '',
      lastName: '',
      professionalPhone: '',
      email: '',
      businessName: '',
    },
    activity: {
      categoryId: '',
      categoryName: '',
      specialtyId: '',
      specialtyName: '',
      professionalTitle: '',
      activityDescription: '',
      yearsOfExperience: '',
      qualifications: '',
    },
    modalities: {
      country: '',
      city: '',
      interventionArea: '',
      practiceAddress: '',
      modes: [],
    },
    offerings: [
      {
        id: `draft-offering-${Date.now()}`,
        title: '',
        description: '',
        indicativePrice: '',
        currency: 'FCFA',
        indicativeDurationMinutes: '',
      },
    ],
    documents: [],
    declarations: {
      confirmsAccuracy: false,
      understandsLocalOnlyStorage: false,
    },
  };
}

function createApplicationId(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `APP-${Date.now()}-${random}`;
}

function normalizeOfferingsForComparison(
  offerings: ProviderApplicationDraft['offerings'] | ProviderApplicationRecord['offerings'],
) {
  return offerings
    .map((offering) => ({
      title: offering.title,
      description: offering.description,
      indicativePrice: offering.indicativePrice,
      currency: offering.currency,
      indicativeDurationMinutes: offering.indicativeDurationMinutes,
    }))
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

function normalizeDocumentsForComparison(
  documents: ProviderApplicationDraft['documents'] | ProviderApplicationRecord['documents'],
) {
  return documents
    .map((item) => ({
      requirementId: item.requirementId,
      kind: item.kind,
      title: item.title,
      note: item.note,
      fileName: item.fileName,
      mimeType: item.mimeType,
      sizeBytes: item.sizeBytes,
    }))
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}

function computeFingerprint(draft: ProviderApplicationDraft): string {
  const source = {
    identity: draft.identity,
    activity: draft.activity,
    modalities: draft.modalities,
    offerings: normalizeOfferingsForComparison(draft.offerings),
    documents: normalizeDocumentsForComparison(draft.documents),
  };

  return JSON.stringify(source);
}

function computeRecordFingerprint(record: ProviderApplicationRecord): string {
  const source = {
    identity: record.identity,
    activity: record.activity,
    modalities: record.modalities,
    offerings: normalizeOfferingsForComparison(record.offerings),
    documents: normalizeDocumentsForComparison(record.documents),
  };

  return JSON.stringify(source);
}

function computeLegacyDraftFingerprint(draft: ProviderApplicationDraft): string {
  const source = {
    identity: draft.identity,
    activity: draft.activity,
    modalities: draft.modalities,
    offerings: draft.offerings,
    documents: normalizeDocumentsForComparison(draft.documents),
  };

  return JSON.stringify(source);
}

function computeLegacyRecordFingerprint(record: ProviderApplicationRecord): string {
  const source = {
    identity: record.identity,
    activity: record.activity,
    modalities: record.modalities,
    offerings: record.offerings,
    documents: normalizeDocumentsForComparison(record.documents),
  };

  return JSON.stringify(source);
}

export function isDraftLinkedToApplication(draft: ProviderApplicationDraft | null, application: ProviderApplicationRecord | null): boolean {
  if (!draft || !application) {
    return false;
  }

  if (draft.startedAt && application.startedAt && draft.startedAt === application.startedAt) {
    return true;
  }

  const draftFingerprint = computeFingerprint(draft);
  const appFingerprint = computeRecordFingerprint(application);
  if (draftFingerprint === appFingerprint) {
    return true;
  }

  // Compatibilite legacy: anciennes candidatures/fingerprints avec IDs techniques inclus.
  const legacyAppFingerprint = application.sourceFingerprint || computeLegacyRecordFingerprint(application);
  const legacyDraftFingerprint = computeLegacyDraftFingerprint(draft);
  return legacyDraftFingerprint === legacyAppFingerprint;
}

export class ProviderApplicationsService {
  async getState() {
    await hydrateProviderApplicationsState();
    return getProviderApplicationsSnapshot();
  }

  async getDraft(): Promise<ProviderApplicationDraft | null> {
    const state = await this.getState();
    return state.draft;
  }

  async saveDraft(draft: ProviderApplicationDraft): Promise<ProviderApplicationDraft> {
    const next = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };

    await saveProviderApplicationDraft(next);
    return next;
  }

  async resetDraft(): Promise<void> {
    await saveProviderApplicationDraft(null);
  }

  async getLatestApplication(): Promise<ProviderApplicationRecord | null> {
    const state = await this.getState();
    return state.applications[0] || null;
  }

  async getApplicationById(id: string): Promise<ProviderApplicationRecord | null> {
    const state = await this.getState();
    return state.applications.find((item) => item.id === id) || null;
  }

  async submitDraft(draft: ProviderApplicationDraft): Promise<ProviderApplicationRecord> {
    const state = await this.getState();
    const now = new Date().toISOString();
    const fingerprint = computeFingerprint(draft);
    const legacyFingerprint = computeLegacyDraftFingerprint(draft);
    const latest = state.applications[0];

    if (latest && latest.status === 'pending') {
      throw new Error('PENDING_APPLICATION_EXISTS');
    }

    if (
      latest
      && new Date(now).getTime() - new Date(latest.submittedAt).getTime() < 5 * 60 * 1000
      && (
        latest.sourceFingerprint === fingerprint
        || latest.sourceFingerprint === legacyFingerprint
        || computeRecordFingerprint(latest) === fingerprint
      )
    ) {
      return latest;
    }

    const record: ProviderApplicationRecord = {
      ...draft,
      id: createApplicationId(),
      createdAt: draft.startedAt,
      submittedAt: now,
      status: 'pending',
      statusLabel: APPLICATION_STATUS_LABELS.pending,
      sourceFingerprint: fingerprint,
      sync: {
        transport: 'local-only',
        synced: false,
        note: 'Candidature enregistrée localement sur cet appareil. Transmission sécurisée à implémenter côté back-end.',
      },
    };

    await saveProviderApplicationRecord(record);
    await saveProviderApplicationDraft(null);

    return record;
  }

  createSupportingDocument(input: {
    requirementId?: string;
    kind: ProviderDocumentKind;
    title: string;
    note?: string;
    fileName?: string;
    mimeType?: string;
    sizeBytes?: number;
    localAssetUri?: string;
  }): ProviderSupportingDocument {
    return {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      requirementId: input.requirementId,
      kind: input.kind,
      title: input.title,
      note: input.note || '',
      fileName: input.fileName || '',
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      localAssetUri: input.localAssetUri,
      addedAt: new Date().toISOString(),
    };
  }

  getCategoryName(categories: ServiceCategory[], categoryId: string): string {
    return categories.find((item) => item.id === categoryId)?.name || '';
  }

  getSpecialtyName(specialties: ServiceSpecialty[], specialtyId: string): string {
    return specialties.find((item) => item.id === specialtyId)?.name || '';
  }
}

export const providerApplicationsService = new ProviderApplicationsService();
