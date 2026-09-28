import React from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { FlexContainer, Loader } from '@/components';
import { ButtonSimple } from '@/components/buttons';
import { useProfessionalDetails } from '@/src/features/services/hooks/useProfessionalDetails';
import { OfferingOptionCard } from '@/src/features/services/components/OfferingOptionCard';

const modeLabel: Record<string, string> = {
  cabinet: 'Cabinet',
  domicile: 'Domicile',
  online: 'En ligne',
};

export function ProfessionalDetailScreen({ professionalId }: { professionalId: string }) {
  const { professional, loading, error, isFavorite, toggleFavorite } = useProfessionalDetails(professionalId);
  const [selectedOfferingId, setSelectedOfferingId] = React.useState<string | undefined>(undefined);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;
  const selectedOffering = professional?.offerings.find((item) => item.id === selectedOfferingId);

  React.useEffect(() => {
    if (professional?.offerings.length && !selectedOfferingId) {
      setSelectedOfferingId(professional.offerings[0].id);
    }
  }, [professional, selectedOfferingId]);

  if (loading) {
    return (
      <FlexContainer color={bg}>
        <Loader visible />
      </FlexContainer>
    );
  }

  if (!professional) {
    return (
      <FlexContainer color={bg}>
        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}> 
          <Text style={[styles.title, { color: text }]}>Profil indisponible</Text>
          <Text style={[styles.subtitle, { color: error ? Colors.danger : muted }]}>{error || 'Le professionnel demandé est introuvable.'}</Text>
        </View>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer color={bg}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}> 
          <View style={styles.headRow}>
            <View style={styles.headMain}>
              <Text style={[styles.title, { color: text }]}>{professional.fullName}</Text>
              <Text style={[styles.subtitle, { color: muted }]}>{professional.headline}</Text>
              <Text style={[styles.meta, { color: muted }]}>{professional.rating.toFixed(1)} ({professional.reviewCount}) · {professional.location.distanceKm.toFixed(1)} km</Text>
            </View>
            <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={22} color={isFavorite ? Colors.danger : muted} />
          </View>

          <View style={styles.separator} />
          <Text style={[styles.bio, { color: text }]}>{professional.biography}</Text>

          <View style={styles.separator} />
          <Text style={[styles.sectionTitle, { color: text }]}>Adresse</Text>
          <Text style={[styles.sectionText, { color: muted }]}>{professional.location.address}</Text>
          <Text style={[styles.sectionText, { color: muted }]}>{professional.location.city}</Text>

          <View style={styles.separator} />
          <Text style={[styles.sectionTitle, { color: text }]}>Disponibilité</Text>
          <Text style={[styles.sectionText, { color: professional.availability.acceptsNewRequests ? Colors.green : Colors.danger }]}>
            {professional.availability.acceptsNewRequests ? `Prochaine dispo: ${professional.availability.nextSlotLabel}` : 'Aucune disponibilité immédiate'}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}> 
          <Text style={[styles.sectionTitle, { color: text }]}>Prestations proposées</Text>
          {professional.offerings.length === 0 ? (
            <Text style={[styles.sectionText, { color: muted }]}>Aucune prestation disponible pour le moment.</Text>
          ) : (
            professional.offerings.map((offer) => (
              <OfferingOptionCard
                key={offer.id}
                offering={offer}
                selected={selectedOfferingId === offer.id}
                onPress={() => setSelectedOfferingId(offer.id)}
              />
            ))
          )}

          {selectedOffering ? (
            <Text style={[styles.selectedText, { color: muted }]}>Sélection actuelle: {selectedOffering.title}</Text>
          ) : (
            <Text style={[styles.selectedText, { color: Colors.danger }]}>Sélectionnez une prestation pour continuer.</Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}> 
          <Text style={[styles.sectionTitle, { color: text }]}>Modes disponibles</Text>
          <View style={styles.modeWrap}>
            {Array.from(new Set(professional.offerings.flatMap((item) => item.modes))).map((mode) => (
              <View key={mode} style={[styles.modePill, { backgroundColor: isDark ? '#1B2026' : '#f6f7f9', borderColor: border }]}> 
                <Text style={[styles.modePillText, { color: text }]}>{modeLabel[mode]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionWrap}>
          <ButtonSimple
            text="Réserver une prestation"
            color={Colors.orange}
            disabled={!selectedOfferingId}
            onPress={() => {
              if (!selectedOfferingId) {
                return;
              }
              router.push({
                pathname: '/services/book/[professionalId]',
                params: { professionalId: professional.id, offeringId: selectedOfferingId },
              });
            }}
          />
        </View>

        <View style={styles.actionWrap}>
          <ButtonSimple
            text={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            color={isFavorite ? Colors.darkColor : Colors.primary}
            onPress={() => {
              toggleFavorite().catch(() => {});
            }}
          />
        </View>
      </ScrollView>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headMain: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#eceef2',
    marginVertical: 10,
  },
  bio: {
    fontSize: 14,
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 20,
  },
  selectedText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  actionWrap: {
    marginBottom: 10,
  },
  modeWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modePill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  modePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
