import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { ProviderApplicationDraft, ProviderDocumentRequirement } from '@/src/features/services/types';

type Props = {
  draft: ProviderApplicationDraft;
  requirements: ProviderDocumentRequirement[];
};

function findBucketCount(requirements: ProviderDocumentRequirement[], bucket: ProviderDocumentRequirement['bucket']) {
  return requirements.filter((item) => item.bucket === bucket).length;
}

export function ProviderApplicationReviewCard({ draft, requirements }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;

  const recommendedCount = findBucketCount(requirements, 'recommended');
  const regulatoryCount = findBucketCount(requirements, 'regulatory_to_confirm');

  return (
    <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
      <Text style={[styles.sectionTitle, { color: text }]}>Identité</Text>
      <Text style={[styles.row, { color: muted }]}>{draft.identity.lastName} {draft.identity.firstName}</Text>
      <Text style={[styles.row, { color: muted }]}>{draft.identity.professionalPhone} · {draft.identity.email}</Text>
      {draft.identity.businessName ? <Text style={[styles.row, { color: muted }]}>{draft.identity.businessName}</Text> : null}

      <Text style={[styles.sectionTitle, { color: text }]}>Activité</Text>
      <Text style={[styles.row, { color: muted }]}>{draft.activity.categoryName || 'Catégorie non sélectionnée'}</Text>
      <Text style={[styles.row, { color: muted }]}>{draft.activity.specialtyName || 'Spécialité non sélectionnée'}</Text>
      <Text style={[styles.row, { color: muted }]}>{draft.activity.professionalTitle}</Text>
      <Text style={[styles.row, { color: muted }]}>{draft.activity.yearsOfExperience} an(s) d’expérience</Text>

      <Text style={[styles.sectionTitle, { color: text }]}>Localisation et modalités</Text>
      <Text style={[styles.row, { color: muted }]}>{draft.modalities.country} · {draft.modalities.city}</Text>
      <Text style={[styles.row, { color: muted }]}>{draft.modalities.interventionArea}</Text>
      <Text style={[styles.row, { color: muted }]}>Modes: {draft.modalities.modes.join(', ') || 'Aucun'}</Text>
      {draft.modalities.practiceAddress ? <Text style={[styles.row, { color: muted }]}>{draft.modalities.practiceAddress}</Text> : null}

      <Text style={[styles.sectionTitle, { color: text }]}>Prestations</Text>
      {draft.offerings.map((offering) => (
        <View key={offering.id} style={styles.offerItem}>
          <Text style={[styles.offerTitle, { color: text }]}>{offering.title || 'Prestation sans intitulé'}</Text>
          <Text style={[styles.row, { color: muted }]}>{offering.description}</Text>
          <Text style={[styles.row, { color: muted }]}>{offering.indicativePrice} {offering.currency} · {offering.indicativeDurationMinutes} min</Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: text }]}>Justificatifs</Text>
      <Text style={[styles.row, { color: muted }]}>Documents déclarés: {draft.documents.length}</Text>
      <Text style={[styles.row, { color: muted }]}>Éléments recommandés: {recommendedCount}</Text>
      <Text style={[styles.row, { color: muted }]}>Obligations réglementaires à confirmer: {regulatoryCount}</Text>

      <View style={[styles.notice, { borderColor: border, backgroundColor: isDark ? '#1A1F25' : '#F6F7F9' }]}>
        <Text style={[styles.noticeText, { color: muted }]}>Les informations sont enregistrées localement sur cet appareil. La transmission sécurisée et la vérification documentaire restent à implémenter côté back-end.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '700',
  },
  row: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },
  offerItem: {
    marginTop: 6,
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  notice: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 12,
  },
  noticeText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
