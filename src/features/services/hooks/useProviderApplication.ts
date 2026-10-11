import { useCallback, useEffect, useMemo, useState } from 'react';
import { servicesService } from '@/src/features/services/services/servicesService';
import { useProviderApplicationsSnapshot } from '@/src/features/services/stores/servicesProviderApplicationsStore';
import {
  ProviderApplicationDraft,
  ProviderApplicationFormErrors,
  ProviderApplicationRecord,
  ProviderDocumentRequirement,
  ProviderServiceMode,
  ProviderServiceOfferingDraft,
  ServiceCategory,
  ServiceSpecialty,
} from '@/src/features/services/types';
import {
  createEmptyProviderDraft,
  getProviderDocumentRequirements,
  isDraftLinkedToApplication,
  providerApplicationsService,
} from '@/src/features/services/services/providerApplicationsService';

export function useProviderApplication() {
  const providerState = useProviderApplicationsSnapshot();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [specialties, setSpecialties] = useState<ServiceSpecialty[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loadingError, setLoadingError] = useState('');
  const [workingDraft, setWorkingDraft] = useState<ProviderApplicationDraft>(providerState.draft || createEmptyProviderDraft());
  const [errors, setErrors] = useState<ProviderApplicationFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadCatalog = async () => {
      setLoadingCatalog(true);
      setLoadingError('');
      try {
        const [nextCategories, nextSpecialties] = await Promise.all([
          servicesService.getCategories(),
          servicesService.getSpecialties(),
        ]);

        if (!active) {
          return;
        }

        setCategories(nextCategories);
        setSpecialties(nextSpecialties);
      } catch {
        if (!active) {
          return;
        }
        setLoadingError('Impossible de charger les catégories pour le moment.');
      } finally {
        if (active) {
          setLoadingCatalog(false);
        }
      }
    };

    loadCatalog().catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (providerState.draft) {
      setWorkingDraft(providerState.draft);
      return;
    }

    // Quand le store ne contient plus de brouillon (ex: après soumission),
    // on réinitialise l'état de travail pour éviter toute réinjection mémoire.
    setWorkingDraft(createEmptyProviderDraft());
  }, [providerState.draft]);

  const latestApplication = providerState.applications[0] || null;
  const hasPendingApplication = Boolean(latestApplication && latestApplication.status === 'pending');
  const draftLinkedToPending = isDraftLinkedToApplication(providerState.draft, hasPendingApplication ? latestApplication : null);
  const hasResumableDraft = Boolean(providerState.draft) && !draftLinkedToPending;

  const requirements = useMemo<ProviderDocumentRequirement[]>(() => {
    return getProviderDocumentRequirements({
      country: workingDraft.modalities.country,
      categoryId: workingDraft.activity.categoryId,
      specialtyId: workingDraft.activity.specialtyId,
    });
  }, [workingDraft.activity.categoryId, workingDraft.activity.specialtyId, workingDraft.modalities.country]);

  const categorySpecialties = useMemo(() => {
    if (!workingDraft.activity.categoryId) {
      return specialties;
    }

    return specialties.filter((item) => item.categoryId === workingDraft.activity.categoryId);
  }, [specialties, workingDraft.activity.categoryId]);

  const updateDraft = useCallback((updater: (prev: ProviderApplicationDraft) => ProviderApplicationDraft) => {
    setWorkingDraft((prev) => {
      const next = updater(prev);
      return {
        ...next,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const saveDraft = useCallback(async () => {
    const next = await providerApplicationsService.saveDraft(workingDraft);
    setWorkingDraft(next);
  }, [workingDraft]);

  const toggleMode = useCallback((mode: ProviderServiceMode) => {
    updateDraft((prev) => {
      const exists = prev.modalities.modes.includes(mode);
      const nextModes = exists
        ? prev.modalities.modes.filter((item) => item !== mode)
        : [...prev.modalities.modes, mode];

      return {
        ...prev,
        modalities: {
          ...prev.modalities,
          modes: nextModes,
          practiceAddress: exists && mode === 'cabinet' ? '' : prev.modalities.practiceAddress,
        },
      };
    });
  }, [updateDraft]);

  const addOffering = useCallback(() => {
    updateDraft((prev) => ({
      ...prev,
      offerings: [
        ...prev.offerings,
        {
          id: `draft-offering-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: '',
          description: '',
          indicativePrice: '',
          currency: 'FCFA',
          indicativeDurationMinutes: '',
        },
      ],
    }));
  }, [updateDraft]);

  const removeOffering = useCallback((id: string) => {
    updateDraft((prev) => {
      const nextOfferings = prev.offerings.filter((item) => item.id !== id);
      return {
        ...prev,
        offerings: nextOfferings.length > 0 ? nextOfferings : [createDefaultOffering()],
      };
    });
  }, [updateDraft]);

  const validateStep = useCallback((step: number): boolean => {
    const nextErrors: ProviderApplicationFormErrors = {};

    if (step >= 2) {
      if (!workingDraft.identity.lastName.trim()) nextErrors.identityLastName = 'Le nom est requis.';
      if (!workingDraft.identity.firstName.trim()) nextErrors.identityFirstName = 'Le prénom est requis.';
      if (!/^\+?[0-9 ]{8,20}$/.test(workingDraft.identity.professionalPhone.trim())) {
        nextErrors.identityPhone = 'Le téléphone professionnel est invalide.';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workingDraft.identity.email.trim())) {
        nextErrors.identityEmail = 'L’adresse e-mail est invalide.';
      }
    }

    if (step >= 3) {
      if (!workingDraft.activity.categoryId) nextErrors.activityCategory = 'Sélectionnez une catégorie.';
      if (!workingDraft.activity.specialtyId) nextErrors.activitySpecialty = 'Sélectionnez une spécialité.';
      if (!workingDraft.activity.professionalTitle.trim()) nextErrors.activityTitle = 'L’intitulé professionnel est requis.';
      if (!workingDraft.activity.activityDescription.trim()) nextErrors.activityDescription = 'La description est requise.';
      if (!/^\d{1,2}$/.test(workingDraft.activity.yearsOfExperience.trim())) nextErrors.activityExperience = 'Saisissez un nombre d’années valide.';
    }

    if (step >= 4) {
      if (!workingDraft.modalities.country.trim()) nextErrors.modalitiesCountry = 'Le pays est requis.';
      if (!workingDraft.modalities.city.trim()) nextErrors.modalitiesCity = 'La ville est requise.';
      if (!workingDraft.modalities.interventionArea.trim()) nextErrors.modalitiesArea = 'La zone d’intervention est requise.';
      if (workingDraft.modalities.modes.length === 0) nextErrors.modalitiesModes = 'Sélectionnez au moins un mode de prestation.';
      if (workingDraft.modalities.modes.includes('cabinet') && !workingDraft.modalities.practiceAddress.trim()) {
        nextErrors.modalitiesPracticeAddress = 'L’adresse professionnelle est requise pour le mode cabinet.';
      }
    }

    if (step >= 5) {
      const hasValidOffering = workingDraft.offerings.some((offering) => {
        return Boolean(
          offering.title.trim()
            && offering.description.trim()
            && offering.currency.trim()
            && /^\d+$/.test(offering.indicativeDurationMinutes.trim())
            && /^\d+(?:[.,]\d{1,2})?$/.test(offering.indicativePrice.trim()),
        );
      });

      if (!hasValidOffering) {
        nextErrors.offerings = 'Ajoutez au moins une prestation complète (intitulé, description, durée, tarif, devise).';
      }
    }

    if (step >= 7) {
      if (!workingDraft.declarations.confirmsAccuracy) {
        nextErrors.reviewAccuracy = 'Confirmez l’exactitude des informations.';
      }
      if (!workingDraft.declarations.understandsLocalOnlyStorage) {
        nextErrors.reviewLocalOnly = 'Confirmez que les données sont enregistrées localement uniquement.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [workingDraft]);

  const submit = useCallback(async (): Promise<ProviderApplicationRecord | null> => {
    if (!validateStep(7)) {
      return null;
    }

    setSubmitting(true);
    try {
      const next = await providerApplicationsService.submitDraft(workingDraft);
      setErrors({});
      return next;
    } finally {
      setSubmitting(false);
    }
  }, [validateStep, workingDraft]);

  return {
    categories,
    specialties: categorySpecialties,
    allSpecialties: specialties,
    loadingCatalog,
    loadingError,
    draft: workingDraft,
    latestApplication,
    hasPendingApplication,
    hasResumableDraft,
    draftLinkedToPending,
    applications: providerState.applications,
    requirements,
    errors,
    submitting,
    setErrors,
    updateDraft,
    saveDraft,
    resetDraft: providerApplicationsService.resetDraft,
    validateStep,
    submit,
    toggleMode,
    addOffering,
    removeOffering,
  };
}

function createDefaultOffering(): ProviderServiceOfferingDraft {
  return {
    id: `draft-offering-${Date.now()}`,
    title: '',
    description: '',
    indicativePrice: '',
    currency: 'FCFA',
    indicativeDurationMinutes: '',
  };
}
