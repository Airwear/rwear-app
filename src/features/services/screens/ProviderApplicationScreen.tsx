import React from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { SelectList } from 'react-native-dropdown-select-list';
import Colors from '@/constants/Colors';
import { FlexContainer } from '@/components';
import { ButtonSimple } from '@/components/buttons';
import { ProviderApplicationStepHeader } from '@/src/features/services/components/ProviderApplicationStepHeader';
import { ProviderProgramIntroCard } from '@/src/features/services/components/ProviderProgramIntroCard';
import { ProviderApplicationReviewCard } from '@/src/features/services/components/ProviderApplicationReviewCard';
import { useProviderApplication } from '@/src/features/services/hooks/useProviderApplication';
import { providerApplicationsService } from '@/src/features/services/services/providerApplicationsService';
import { ProviderDocumentKind, ProviderDocumentRequirement, ProviderServiceMode } from '@/src/features/services/types';

const TOTAL_STEPS = 7;

const STEP_META: Array<{ title: string; subtitle: string }> = [
  {
    title: 'Présentation du programme',
    subtitle: 'Comprenez le fonctionnement du parcours prestataire avant de démarrer.',
  },
  {
    title: 'Identité et coordonnées',
    subtitle: 'Renseignez vos informations professionnelles sans modifier votre compte utilisateur.',
  },
  {
    title: 'Activité professionnelle',
    subtitle: 'Sélectionnez votre catégorie et décrivez votre expertise.',
  },
  {
    title: 'Localisation et modalités',
    subtitle: 'Indiquez vos zones d’intervention et vos modes de prestation.',
  },
  {
    title: 'Prestations et tarifs',
    subtitle: 'Ajoutez au moins une prestation avec tarif et durée indicatifs.',
  },
  {
    title: 'Justificatifs professionnels',
    subtitle: 'Déclarez vos documents et ajoutez un fichier local si disponible.',
  },
  {
    title: 'Vérification et soumission',
    subtitle: 'Contrôlez vos informations avant soumission locale du dossier.',
  },
];

const MODE_LABELS: Record<ProviderServiceMode, string> = {
  cabinet: 'Cabinet',
  domicile: 'Domicile',
  online: 'En ligne',
};

const DOC_KIND_LABELS: Record<ProviderDocumentKind, string> = {
  diploma: 'Diplôme',
  training_attestation: 'Attestation de formation',
  professional_certification: 'Certification professionnelle',
  authorization: 'Autorisation / permis d’exercice',
  professional_registration: 'Enregistrement professionnel',
  other: 'Autre justificatif',
};

function isMeaningfulDraft(draft: ReturnType<typeof useProviderApplication>['draft']): boolean {
  const hasIdentity = Boolean(
    draft.identity.firstName.trim()
    || draft.identity.lastName.trim()
    || draft.identity.professionalPhone.trim()
    || draft.identity.email.trim()
    || (draft.identity.businessName || '').trim(),
  );
  const hasActivity = Boolean(
    draft.activity.categoryId
    || draft.activity.specialtyId
    || draft.activity.professionalTitle.trim()
    || draft.activity.activityDescription.trim()
    || draft.activity.yearsOfExperience.trim()
    || draft.activity.qualifications.trim(),
  );
  const hasModalities = Boolean(
    draft.modalities.country.trim()
    || draft.modalities.city.trim()
    || draft.modalities.interventionArea.trim()
    || draft.modalities.practiceAddress.trim()
    || draft.modalities.modes.length > 0,
  );
  const hasOfferings = draft.offerings.some((offering) => (
    offering.title.trim()
    || offering.description.trim()
    || offering.indicativePrice.trim()
    || offering.indicativeDurationMinutes.trim()
    || offering.currency.trim() !== 'FCFA'
  ));
  const hasDocuments = draft.documents.length > 0;

  return hasIdentity || hasActivity || hasModalities || hasOfferings || hasDocuments;
}

export function ProviderApplicationScreen() {
  const {
    categories,
    specialties,
    allSpecialties,
    loadingCatalog,
    loadingError,
    draft,
    hasPendingApplication,
    hasResumableDraft,
    draftLinkedToPending,
    requirements,
    errors,
    submitting,
    setErrors,
    updateDraft,
    saveDraft,
    validateStep,
    submit,
    toggleMode,
    addOffering,
    removeOffering,
  } = useProviderApplication();

  const [step, setStep] = React.useState(1);
  const [docRequirementId, setDocRequirementId] = React.useState<string>('');
  const [docTitle, setDocTitle] = React.useState('');
  const [docNote, setDocNote] = React.useState('');
  const [docKind, setDocKind] = React.useState<ProviderDocumentKind>('other');
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const scrollRef = React.useRef<ScrollView>(null);
  const contentRef = React.useRef<View>(null);
  const autosaveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const blockAutosaveRef = React.useRef(false);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;
  const inputBg = isDark ? '#1A1F25' : '#fcfcfd';

  React.useEffect(() => {
    if (blockAutosaveRef.current || submitting) {
      return;
    }

    // Ne pas créer automatiquement de brouillon vide tant qu'aucune saisie métier réelle n'est faite.
    if (!isMeaningfulDraft(draft)) {
      return;
    }

    autosaveTimerRef.current = setTimeout(() => {
      saveDraft().catch(() => {});
    }, 450);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
    };
  }, [draft, saveDraft, submitting]);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const requirementOptions = requirements.map((item) => ({ key: item.id, value: item.title }));
  const docKindOptions = Object.entries(DOC_KIND_LABELS).map(([key, value]) => ({ key, value }));

  const nextStep = () => {
    const canProceed = step === 1 || validateStep(step);
    if (!canProceed) {
      return;
    }

    setStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    blockAutosaveRef.current = true;

    let created = null;
    try {
      created = await submit();
    } catch (error) {
      blockAutosaveRef.current = false;
      if (error instanceof Error && error.message === 'PENDING_APPLICATION_EXISTS') {
        Alert.alert(
          'Candidature déjà en attente',
          'Une candidature est déjà en attente de validation sur cet appareil. Vous ne pouvez pas en soumettre une nouvelle pour le moment.',
        );
        router.replace('/services/provider/application-status');
        return;
      }

      throw error;
    }

    // Évite une resauvegarde de brouillon juste avant démontage/navigation.
    blockAutosaveRef.current = true;

    if (!created) {
      return;
    }

    Alert.alert('Candidature enregistrée', 'Votre dossier est enregistré localement avec le statut En attente de validation.');
    router.replace('/services/provider/application-status');
  };

  const onPickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.canceled || !result.assets.length) {
      return;
    }

    const asset = result.assets[0];
    const selectedRequirement = requirements.find((item) => item.id === docRequirementId);

    const document = providerApplicationsService.createSupportingDocument({
      requirementId: selectedRequirement?.id,
      kind: selectedRequirement?.kind || docKind,
      title: docTitle.trim() || selectedRequirement?.title || DOC_KIND_LABELS[docKind],
      note: docNote.trim(),
      fileName: asset.fileName || '',
      mimeType: asset.mimeType,
      sizeBytes: asset.fileSize,
      localAssetUri: asset.uri,
    });

    updateDraft((prev) => ({
      ...prev,
      documents: [document, ...prev.documents],
    }));

    setDocTitle('');
    setDocNote('');
    setDocRequirementId('');
  };

  const removeDocument = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      documents: prev.documents.filter((item) => item.id !== id),
    }));
  };

  const updateCategory = (categoryId: string) => {
    const categoryName = categories.find((item) => item.id === categoryId)?.name || '';

    updateDraft((prev) => ({
      ...prev,
      activity: {
        ...prev.activity,
        categoryId,
        categoryName,
        specialtyId: '',
        specialtyName: '',
      },
    }));

    setErrors((prev) => ({
      ...prev,
      activityCategory: undefined,
      activitySpecialty: undefined,
    }));
  };

  const updateSpecialty = (specialtyId: string) => {
    const specialtyName = allSpecialties.find((item) => item.id === specialtyId)?.name || '';

    updateDraft((prev) => ({
      ...prev,
      activity: {
        ...prev.activity,
        specialtyId,
        specialtyName,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      activitySpecialty: undefined,
    }));
  };

  const onFocusField = (target: View | null) => {
    if (!target || !contentRef.current || !scrollRef.current) {
      return;
    }

    target.measureLayout(
      contentRef.current,
      (_x, y) => {
        scrollRef.current?.scrollTo({ y: Math.max(0, y - 110), animated: true });
      },
      () => {},
    );
  };

  const clearStepError = (key: keyof typeof errors) => {
    setErrors((prev) => {
      if (!prev[key]) {
        return prev;
      }

      return {
        ...prev,
        [key]: undefined,
      };
    });
  };

  const header = STEP_META[step - 1];

  return (
    <FlexContainer color={bg}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.keyboardAvoider} onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[styles.scroll, { paddingBottom: keyboardHeight + 34 }]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View ref={contentRef}>
              <ProviderApplicationStepHeader
                step={step}
                total={TOTAL_STEPS}
                title={header.title}
                subtitle={header.subtitle}
              />

              {loadingError ? (
                <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
                  <Text style={[styles.errorText, { color: Colors.danger }]}>{loadingError}</Text>
                </View>
              ) : null}

              {step === 1 ? (
                <ProviderProgramIntroCard title="Devenir prestataire sur Rwear" />
              ) : null}

        {step === 2 ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <LabeledInput
              label="Nom"
              value={draft.identity.lastName}
              onChangeText={(value) => {
                updateDraft((prev) => ({ ...prev, identity: { ...prev.identity, lastName: value } }));
                if (value.trim()) {
                  clearStepError('identityLastName');
                }
              }}
              error={errors.identityLastName}
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
            <LabeledInput
              label="Prénom"
              value={draft.identity.firstName}
              onChangeText={(value) => {
                updateDraft((prev) => ({ ...prev, identity: { ...prev.identity, firstName: value } }));
                if (value.trim()) {
                  clearStepError('identityFirstName');
                }
              }}
              error={errors.identityFirstName}
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
            <LabeledInput
              label="Téléphone professionnel"
              value={draft.identity.professionalPhone}
              onChangeText={(value) => {
                updateDraft((prev) => ({ ...prev, identity: { ...prev.identity, professionalPhone: value } }));
                if (/^\+?[0-9 ]{8,20}$/.test(value.trim())) {
                  clearStepError('identityPhone');
                }
              }}
              error={errors.identityPhone}
              keyboardType="phone-pad"
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
            <LabeledInput
              label="Adresse e-mail"
              value={draft.identity.email}
              onChangeText={(value) => {
                updateDraft((prev) => ({ ...prev, identity: { ...prev.identity, email: value } }));
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                  clearStepError('identityEmail');
                }
              }}
              error={errors.identityEmail}
              keyboardType="email-address"
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
            <LabeledInput
              label="Nom commercial (facultatif)"
              value={draft.identity.businessName || ''}
              onChangeText={(value) => updateDraft((prev) => ({ ...prev, identity: { ...prev.identity, businessName: value } }))}
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
          </View>
        ) : null}

        {step === 3 ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.label, { color: muted }]}>Catégorie de services</Text>
            <StyledSelect
              data={categories.map((item) => ({ key: item.id, value: item.name }))}
              selected={draft.activity.categoryName || 'Sélectionner'}
              onSelect={updateCategory}
            />
            {errors.activityCategory ? <Text style={styles.errorText}>{errors.activityCategory}</Text> : null}

            <Text style={[styles.label, { color: muted }]}>Spécialité</Text>
            <StyledSelect
              data={specialties.map((item) => ({ key: item.id, value: item.name }))}
              selected={draft.activity.specialtyName || 'Sélectionner'}
              onSelect={updateSpecialty}
            />
            {errors.activitySpecialty ? <Text style={styles.errorText}>{errors.activitySpecialty}</Text> : null}

            <LabeledInput
              label="Intitulé professionnel"
              value={draft.activity.professionalTitle}
              onChangeText={(value) => {
                updateDraft((prev) => ({ ...prev, activity: { ...prev.activity, professionalTitle: value } }));
                if (value.trim()) {
                  clearStepError('activityTitle');
                }
              }}
              error={errors.activityTitle}
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
            <LabeledInput
              label="Description de l’activité"
              value={draft.activity.activityDescription}
              onChangeText={(value) => {
                updateDraft((prev) => ({ ...prev, activity: { ...prev.activity, activityDescription: value } }));
                if (value.trim()) {
                  clearStepError('activityDescription');
                }
              }}
              error={errors.activityDescription}
              multiline
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
            <LabeledInput
              label="Années d’expérience"
              value={draft.activity.yearsOfExperience}
              onChangeText={(value) => {
                const sanitized = value.replace(/[^0-9]/g, '');
                updateDraft((prev) => ({ ...prev, activity: { ...prev.activity, yearsOfExperience: sanitized } }));
                if (/^\d{1,2}$/.test(sanitized.trim())) {
                  clearStepError('activityExperience');
                }
              }}
              error={errors.activityExperience}
              keyboardType="number-pad"
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
            <LabeledInput
              label="Qualifications / formations"
              value={draft.activity.qualifications}
              onChangeText={(value) => updateDraft((prev) => ({ ...prev, activity: { ...prev.activity, qualifications: value } }))}
              multiline
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
          </View>
        ) : null}

        {step === 4 ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <LabeledInput
              label="Pays"
              value={draft.modalities.country}
              onChangeText={(value) => {
                updateDraft((prev) => ({ ...prev, modalities: { ...prev.modalities, country: value } }));
                if (value.trim()) {
                  clearStepError('modalitiesCountry');
                }
              }}
              error={errors.modalitiesCountry}
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
            <LabeledInput
              label="Ville"
              value={draft.modalities.city}
              onChangeText={(value) => {
                updateDraft((prev) => ({ ...prev, modalities: { ...prev.modalities, city: value } }));
                if (value.trim()) {
                  clearStepError('modalitiesCity');
                }
              }}
              error={errors.modalitiesCity}
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
            <LabeledInput
              label="Quartier / zone d’intervention"
              value={draft.modalities.interventionArea}
              onChangeText={(value) => {
                updateDraft((prev) => ({ ...prev, modalities: { ...prev.modalities, interventionArea: value } }));
                if (value.trim()) {
                  clearStepError('modalitiesArea');
                }
              }}
              error={errors.modalitiesArea}
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />

            <Text style={[styles.label, { color: muted }]}>Modes de prestation</Text>
            <View style={styles.modeWrap}>
              {(['cabinet', 'domicile', 'online'] as ProviderServiceMode[]).map((mode) => {
                const active = draft.modalities.modes.includes(mode);
                return (
                  <Pressable
                    key={mode}
                    onPress={() => {
                      toggleMode(mode);
                      clearStepError('modalitiesModes');
                      if (mode !== 'cabinet') {
                        clearStepError('modalitiesPracticeAddress');
                      }
                    }}
                    style={({ pressed }) => [
                      styles.modePill,
                      {
                        backgroundColor: active ? Colors.orange : inputBg,
                        borderColor: active ? Colors.orange : border,
                        opacity: pressed ? 0.92 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.modePillText, { color: active ? Colors.white : text }]}>{MODE_LABELS[mode]}</Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.modalitiesModes ? <Text style={styles.errorText}>{errors.modalitiesModes}</Text> : null}

            {draft.modalities.modes.includes('cabinet') ? (
              <LabeledInput
                label="Adresse professionnelle"
                value={draft.modalities.practiceAddress}
                onChangeText={(value) => {
                  updateDraft((prev) => ({ ...prev, modalities: { ...prev.modalities, practiceAddress: value } }));
                  if (value.trim()) {
                    clearStepError('modalitiesPracticeAddress');
                  }
                }}
                error={errors.modalitiesPracticeAddress}
                text={text}
                muted={muted}
                inputBg={inputBg}
                border={border}
                onFocusField={onFocusField}
              />
            ) : null}
          </View>
        ) : null}

        {step === 5 ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            {draft.offerings.map((offering, index) => (
              <View key={offering.id} style={[styles.offeringCard, { borderColor: border, backgroundColor: inputBg }]}>
                <View style={styles.offeringHead}>
                  <Text style={[styles.offeringTitle, { color: text }]}>Prestation {index + 1}</Text>
                  <Pressable onPress={() => removeOffering(offering.id)}>
                    <FontAwesome name="trash" size={16} color={Colors.danger} />
                  </Pressable>
                </View>
                <LabeledInput
                  label="Intitulé"
                  value={offering.title}
                  onChangeText={(value) => updateDraft((prev) => ({
                    ...prev,
                    offerings: prev.offerings.map((item) => (item.id === offering.id ? { ...item, title: value } : item)),
                  }))}
                  text={text}
                  muted={muted}
                  inputBg={surface}
                  border={border}
                  onFocusField={onFocusField}
                />
                <LabeledInput
                  label="Description"
                  value={offering.description}
                  onChangeText={(value) => updateDraft((prev) => ({
                    ...prev,
                    offerings: prev.offerings.map((item) => (item.id === offering.id ? { ...item, description: value } : item)),
                  }))}
                  multiline
                  text={text}
                  muted={muted}
                  inputBg={surface}
                  border={border}
                  onFocusField={onFocusField}
                />
                <View style={styles.priceRow}>
                  <View style={styles.priceCol}>
                    <LabeledInput
                      label="Tarif indicatif"
                      value={offering.indicativePrice}
                      onChangeText={(value) => {
                        const sanitized = value.replace(/[^0-9.,]/g, '');
                        updateDraft((prev) => ({
                          ...prev,
                          offerings: prev.offerings.map((item) => (item.id === offering.id ? { ...item, indicativePrice: sanitized } : item)),
                        }));
                        clearStepError('offerings');
                      }}
                      keyboardType="decimal-pad"
                      text={text}
                      muted={muted}
                      inputBg={surface}
                      border={border}
                      onFocusField={onFocusField}
                    />
                  </View>
                  <View style={[styles.priceCol, styles.leftGap]}>
                    <LabeledInput
                      label="Devise"
                      value={offering.currency}
                      onChangeText={(value) => updateDraft((prev) => ({
                        ...prev,
                        offerings: prev.offerings.map((item) => (item.id === offering.id ? { ...item, currency: value.toUpperCase() } : item)),
                      }))}
                      text={text}
                      muted={muted}
                      inputBg={surface}
                      border={border}
                      onFocusField={onFocusField}
                    />
                  </View>
                </View>
                <LabeledInput
                  label="Durée indicative (minutes)"
                  value={offering.indicativeDurationMinutes}
                  onChangeText={(value) => {
                    const sanitized = value.replace(/[^0-9]/g, '');
                    updateDraft((prev) => ({
                      ...prev,
                      offerings: prev.offerings.map((item) => (item.id === offering.id ? { ...item, indicativeDurationMinutes: sanitized } : item)),
                    }));
                    clearStepError('offerings');
                  }}
                  keyboardType="number-pad"
                  text={text}
                  muted={muted}
                  inputBg={surface}
                  border={border}
                  onFocusField={onFocusField}
                />
              </View>
            ))}

            {errors.offerings ? <Text style={styles.errorText}>{errors.offerings}</Text> : null}

            <ButtonSimple text="Ajouter une prestation" color={Colors.darkColor} onPress={addOffering} />
          </View>
        ) : null}

        {step === 6 ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <DocumentBucket title="Justificatifs recommandés" items={requirements.filter((item) => item.bucket === 'recommended')} muted={muted} text={text} />
            <DocumentBucket title="Obligations réglementaires à confirmer" items={requirements.filter((item) => item.bucket === 'regulatory_to_confirm')} muted={muted} text={text} />

            <Text style={[styles.label, { color: muted }]}>Type de justificatif</Text>
            <StyledSelect
              data={docKindOptions}
              selected={DOC_KIND_LABELS[docKind]}
              onSelect={(value) => setDocKind(value as ProviderDocumentKind)}
            />

            <Text style={[styles.label, { color: muted }]}>Associer à une recommandation (optionnel)</Text>
            <StyledSelect
              data={[{ key: '', value: 'Aucune' }, ...requirementOptions]}
              selected={requirements.find((item) => item.id === docRequirementId)?.title || 'Aucune'}
              onSelect={(value) => setDocRequirementId(value)}
            />

            <LabeledInput
              label="Titre du justificatif"
              value={docTitle}
              onChangeText={setDocTitle}
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />
            <LabeledInput
              label="Commentaire (facultatif)"
              value={docNote}
              onChangeText={setDocNote}
              multiline
              text={text}
              muted={muted}
              inputBg={inputBg}
              border={border}
              onFocusField={onFocusField}
            />

            <View style={styles.actionsRow}>
              <View style={styles.actionCol}>
                <ButtonSimple
                  text="Ajouter depuis la galerie"
                  color={Colors.primary}
                  onPress={() => {
                    onPickDocument().catch(() => {
                      Alert.alert('Ajout impossible', 'Impossible d’accéder à la galerie pour le moment.');
                    });
                  }}
                />
              </View>
            </View>

            <Text style={[styles.helpText, { color: muted }]}>Les fichiers choisis via la galerie peuvent être temporaires sur l’appareil. Cette version ne réalise pas de stockage serveur ni de vérification documentaire.</Text>

            {draft.documents.map((item) => (
              <View key={item.id} style={[styles.documentRow, { borderColor: border, backgroundColor: inputBg }]}>
                <View style={styles.documentMain}>
                  <Text style={[styles.documentTitle, { color: text }]}>{item.title}</Text>
                  <Text style={[styles.documentMeta, { color: muted }]}>{DOC_KIND_LABELS[item.kind]}{item.fileName ? ` · ${item.fileName}` : ''}</Text>
                  <Text style={[styles.documentMeta, { color: muted }]}>{item.localAssetUri ? 'Fichier local associé (session en cours)' : 'Fichier à re-sélectionner après redémarrage'}</Text>
                </View>
                <Pressable onPress={() => removeDocument(item.id)}>
                  <FontAwesome name="times-circle" size={18} color={Colors.danger} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}

        {step === 7 ? (
          <>
            <ProviderApplicationReviewCard draft={draft} requirements={requirements} />
            <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
              <CheckLine
                checked={draft.declarations.confirmsAccuracy}
                onPress={() => updateDraft((prev) => ({
                  ...prev,
                  declarations: {
                    ...prev.declarations,
                    confirmsAccuracy: !prev.declarations.confirmsAccuracy,
                  },
                }))}
                label="Je confirme l’exactitude des informations renseignées."
                text={text}
                muted={muted}
              />
              {errors.reviewAccuracy ? <Text style={styles.errorText}>{errors.reviewAccuracy}</Text> : null}

              <CheckLine
                checked={draft.declarations.understandsLocalOnlyStorage}
                onPress={() => updateDraft((prev) => ({
                  ...prev,
                  declarations: {
                    ...prev.declarations,
                    understandsLocalOnlyStorage: !prev.declarations.understandsLocalOnlyStorage,
                  },
                }))}
                label="Je comprends que cette candidature est enregistrée localement et non encore transmise de manière sécurisée."
                text={text}
                muted={muted}
              />
              {errors.reviewLocalOnly ? <Text style={styles.errorText}>{errors.reviewLocalOnly}</Text> : null}
            </View>
          </>
        ) : null}

        <View style={styles.footerActions}>
          {step > 1 ? (
            <View style={styles.actionItem}>
              <ButtonSimple text="Précédent" color={Colors.darkColor} onPress={prevStep} />
            </View>
          ) : null}

          {step < TOTAL_STEPS ? (
            <View style={styles.actionItem}>
              <ButtonSimple
                text={step === 1 ? 'Commencer ma candidature' : 'Continuer'}
                color={Colors.primary}
                onPress={nextStep}
                disabled={loadingCatalog}
              />
            </View>
          ) : (
            <View style={styles.actionItem}>
              <ButtonSimple
                text="Soumettre ma candidature"
                color={Colors.orange}
                onPress={() => {
                  onSubmit().catch(() => {
                    Alert.alert('Soumission impossible', 'Une erreur est survenue pendant la soumission locale.');
                  });
                }}
                showIndicator={submitting}
                disabled={submitting}
              />
            </View>
          )}
        </View>
            </View>
          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>
    </FlexContainer>
  );
}

type LabeledInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad' | 'decimal-pad';
  multiline?: boolean;
  text: string;
  muted: string;
  inputBg: string;
  border: string;
  onFocusField?: (target: View | null) => void;
};

function LabeledInput({
  label,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  multiline = false,
  text,
  muted,
  inputBg,
  border,
  onFocusField,
}: LabeledInputProps) {
  const fieldRef = React.useRef<View>(null);

  return (
    <View style={styles.inputBlock} ref={fieldRef}>
      <Text style={[styles.label, { color: muted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        onFocus={() => onFocusField?.(fieldRef.current)}
        style={[
          styles.input,
          {
            color: text,
            backgroundColor: inputBg,
            borderColor: border,
            minHeight: multiline ? 100 : 47,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function StyledSelect({
  data,
  selected,
  onSelect,
}: {
  data: Array<{ key: string; value: string }>;
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.selectWrap}>
      <SelectList
        data={data}
        save="key"
        setSelected={(value: string) => onSelect(value)}
        search={false}
        placeholder={selected}
        boxStyles={styles.selectBox}
        inputStyles={styles.selectInput}
        dropdownStyles={styles.selectDropdown}
        dropdownTextStyles={styles.selectDropdownText}
      />
    </View>
  );
}

function DocumentBucket({
  title,
  items,
  muted,
  text,
}: {
  title: string;
  items: ProviderDocumentRequirement[];
  muted: string;
  text: string;
}) {
  return (
    <View style={styles.bucket}>
      <Text style={[styles.bucketTitle, { color: text }]}>{title}</Text>
      {items.length === 0 ? (
        <Text style={[styles.helpText, { color: muted }]}>Aucun élément spécifique pour cette sélection.</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.bucketItem}>
            <Text style={[styles.bucketText, { color: muted }]}>{item.title}</Text>
            {item.description ? <Text style={[styles.bucketSubText, { color: muted }]}>{item.description}</Text> : null}
          </View>
        ))
      )}
    </View>
  );
}

function CheckLine({
  checked,
  onPress,
  label,
  text,
  muted,
}: {
  checked: boolean;
  onPress: () => void;
  label: string;
  text: string;
  muted: string;
}) {
  return (
    <Pressable onPress={onPress} style={styles.checkRow}>
      <FontAwesome name={checked ? 'check-square' : 'square-o'} size={20} color={checked ? Colors.orange : muted} />
      <Text style={[styles.checkLabel, { color: text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  keyboardAvoider: {
    flex: 1,
  },
  scroll: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 34,
    flexGrow: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputBlock: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
  },
  errorText: {
    marginTop: 4,
    color: Colors.danger,
    fontSize: 12,
    lineHeight: 17,
  },
  selectWrap: {
    marginBottom: 10,
  },
  selectBox: {
    borderRadius: 12,
    borderColor: '#e2e5ea',
    backgroundColor: '#fcfcfd',
    minHeight: 47,
  },
  selectInput: {
    color: Colors.black,
    fontSize: 15,
  },
  selectDropdown: {
    borderColor: '#e2e5ea',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  selectDropdownText: {
    color: Colors.darkColor,
    fontSize: 14,
  },
  modeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  modePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  offeringCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  offeringHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  offeringTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceCol: {
    flex: 1,
  },
  leftGap: {
    marginLeft: 8,
  },
  bucket: {
    marginBottom: 12,
  },
  bucketTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  bucketItem: {
    marginBottom: 6,
  },
  bucketText: {
    fontSize: 12,
    lineHeight: 18,
  },
  bucketSubText: {
    fontSize: 11,
    lineHeight: 16,
  },
  actionsRow: {
    marginTop: 4,
    marginBottom: 8,
  },
  actionCol: {
    width: '100%',
  },
  helpText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  documentRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  documentMain: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  documentMeta: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  checkLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  footerActions: {
    marginTop: 2,
  },
  actionItem: {
    marginBottom: 10,
  },
});
