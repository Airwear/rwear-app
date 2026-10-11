import React from 'react';
import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { FlexContainer } from '@/components';
import { ButtonSimple } from '@/components/buttons';
import { useProviderApplication } from '@/src/features/services/hooks/useProviderApplication';

function formatDate(value: string) {
  return new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
}

export function ProviderApplicationStatusScreen() {
  const {
    latestApplication,
    draft,
    hasPendingApplication,
    hasResumableDraft,
  } = useProviderApplication();

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;

  return (
    <FlexContainer color={bg}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
          <Text style={[styles.title, { color: text }]}>Candidature prestataire</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Retrouvez ici le statut de votre dossier et reprenez votre parcours si nécessaire.</Text>
        </View>

        {latestApplication ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>Dernière candidature</Text>
            <Text style={[styles.row, { color: muted }]}>Référence: {latestApplication.id}</Text>
            <Text style={[styles.row, { color: muted }]}>Déposée le: {formatDate(latestApplication.submittedAt)}</Text>
            <Text style={[styles.pendingLabel, { color: Colors.orange }]}>Statut: {latestApplication.statusLabel}</Text>
            <View style={[styles.notice, { borderColor: border, backgroundColor: isDark ? '#1A1F25' : '#F6F7F9' }]}>
              <Text style={[styles.noticeText, { color: muted }]}>{latestApplication.sync.note}</Text>
            </View>
          </View>
        ) : null}

        {hasResumableDraft && draft ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>Brouillon trouvé</Text>
            <Text style={[styles.row, { color: muted }]}>Dernière mise à jour: {formatDate(draft.updatedAt)}</Text>
          </View>
        ) : null}

        {!latestApplication && !hasResumableDraft ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>Aucune candidature enregistrée</Text>
            <Text style={[styles.row, { color: muted }]}>Commencez votre inscription professionnelle pour créer un dossier local.</Text>
          </View>
        ) : null}

        {hasPendingApplication && !hasResumableDraft ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>Nouvelle candidature</Text>
            <Text style={[styles.row, { color: muted }]}>Une candidature est déjà en attente sur cet appareil. La création d’un nouveau dossier est bloquée pour éviter les doublons involontaires.</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <ButtonSimple
            text={hasResumableDraft ? 'Reprendre mon brouillon' : 'Commencer ma candidature'}
            color={Colors.primary}
            disabled={hasPendingApplication && !hasResumableDraft}
            onPress={() => {
              router.push('/services/provider/apply');
            }}
          />
        </View>

        {latestApplication && !hasPendingApplication ? (
          <View style={styles.actions}>
            <ButtonSimple
              text="Créer une nouvelle candidature"
              color={Colors.darkColor}
              onPress={() => {
                router.push('/services/provider/apply');
              }}
            />
          </View>
        ) : null}
      </ScrollView>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  row: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  pendingLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
  },
  notice: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  noticeText: {
    fontSize: 12,
    lineHeight: 18,
  },
  actions: {
    marginBottom: 10,
  },
});
