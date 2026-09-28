import React from 'react';
import { Alert, BackHandler, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { FlexContainer, Form, Loader } from '@/components';
import { ButtonSimple } from '@/components/buttons';
import { BookingStepHeader } from '@/src/features/services/components/BookingStepHeader';
import { OfferingOptionCard } from '@/src/features/services/components/OfferingOptionCard';
import { useBookingFlow } from '@/src/features/services/hooks/useBookingFlow';

const MODE_LABELS = {
  cabinet: 'Au cabinet',
  domicile: 'À domicile',
  online: 'En ligne',
} as const;

export function BookingFlowScreen({ professionalId, initialOfferingId }: { professionalId: string; initialOfferingId?: string }) {
  const {
    professional,
    selectedOffering,
    selectedOfferingId,
    selectedMode,
    selectedDay,
    selectedSlot,
    selectedDayId,
    selectedSlotId,
    clientAddress,
    step,
    availability,
    loading,
    saving,
    error,
    createdBooking,
    setSelectedOfferingId,
    setSelectedMode,
    setSelectedDayId,
    setSelectedSlotId,
    setClientAddress,
    goNext,
    goBack,
    confirmBooking,
  } = useBookingFlow(professionalId, initialOfferingId);
  const navigation = useNavigation();
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;

  const handleScreenBack = React.useCallback(() => {
    if (step === 5 && createdBooking) {
      router.replace(`/planning/${createdBooking.id}`);
      return true;
    }

    if (goBack()) {
      return true;
    }

    router.back();
    return true;
  }, [createdBooking, goBack, router, step]);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        return handleScreenBack();
      });

      return () => subscription.remove();
    }, [handleScreenBack]),
  );

  React.useEffect(() => {
    navigation.setOptions({
      title: step === 5 ? 'Réservation créée' : 'Réserver',
      headerTitleAlign: 'center',
      headerLeftContainerStyle: styles.headerLeftContainer,
      headerRightContainerStyle: styles.headerRightContainer,
      headerLeft: () => (
        <Pressable
          onPress={handleScreenBack}
          style={styles.headerBack}
        >
          <Text numberOfLines={1} style={[styles.headerBackText, { color: text }]}>
            {step === 5 ? 'Fermer' : step === 1 ? 'Retour' : 'Étape précédente'}
          </Text>
        </Pressable>
      ),
      // Keep title visually centered by reserving space on the right.
      headerRight: () => <View style={styles.headerRightSpacer} />,
    });
  }, [handleScreenBack, navigation, step, text]);

  if (loading && !professional) {
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
          <Text style={[styles.title, { color: text }]}>Réservation indisponible</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Le professionnel demandé est introuvable.</Text>
        </View>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer color={bg}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {step < 5 ? (
          <BookingStepHeader
            currentStep={step}
            totalSteps={4}
            title={step === 1 ? 'Choisir une prestation' : step === 2 ? 'Choisir un mode' : step === 3 ? 'Choisir un créneau' : 'Vérifier avant confirmation'}
            subtitle={step === 1 ? 'Sélectionnez la prestation qui vous convient.' : step === 2 ? 'Choisissez comment aura lieu le rendez-vous.' : step === 3 ? 'Sélectionnez une date et un horaire disponibles.' : 'Relisez les informations avant d’envoyer votre demande.'}
          />
        ) : null}

        {error.length > 0 ? (
          <View style={[styles.errorCard, { backgroundColor: isDark ? '#3A1F24' : '#fdeaea' }]}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {step === 1 ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>Prestations de {professional.fullName}</Text>
            {professional.offerings.map((offering) => (
              <OfferingOptionCard
                key={offering.id}
                offering={offering}
                selected={selectedOfferingId === offering.id}
                onPress={() => setSelectedOfferingId(offering.id)}
              />
            ))}
          </View>
        ) : null}

        {step === 2 && selectedOffering ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>Mode de rendez-vous</Text>
            {selectedOffering.modes.map((mode) => {
              const active = selectedMode === mode;
              return (
                <Pressable
                  key={mode}
                  onPress={() => setSelectedMode(mode)}
                  style={({ pressed }) => [
                    styles.modeChoice,
                    {
                      backgroundColor: active ? (isDark ? '#2B2417' : '#FFF4E8') : surface,
                      borderColor: active ? Colors.orange : border,
                      opacity: pressed ? 0.95 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.modeTitle, { color: active ? Colors.orange : text }]}>{MODE_LABELS[mode]}</Text>
                  <Text style={[styles.modeText, { color: muted }]}>
                    {mode === 'cabinet' ? professional.location.address : mode === 'domicile' ? 'Le professionnel se déplace à votre adresse.' : 'La séance se fera à distance.'}
                  </Text>
                </Pressable>
              );
            })}

            {selectedMode === 'domicile' ? (
              <Form.Input
                label="Adresse client"
                placeholder="Votre adresse pour l’intervention"
                value={clientAddress}
                onChangeText={setClientAddress}
                error={undefined}
              />
            ) : null}
          </View>
        ) : null}

        {step === 3 && selectedOffering ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayList}>
              {availability.map((day) => {
                const active = day.id === selectedDayId;
                return (
                  <Pressable
                    key={day.id}
                    onPress={() => {
                      setSelectedDayId(day.id);
                      const firstAvailableSlot = day.slots.find((slot) => slot.available);
                      setSelectedSlotId(firstAvailableSlot?.id);
                    }}
                    style={({ pressed }) => [
                      styles.dayChip,
                      {
                        backgroundColor: active ? Colors.orange : surface,
                        borderColor: active ? Colors.orange : border,
                        opacity: pressed ? 0.95 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.dayChipText, { color: active ? Colors.white : text }]}>{day.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: text }]}>Heure</Text>
            <View style={styles.slotGrid}>
              {selectedDay?.slots.map((slot) => {
                const active = slot.id === selectedSlotId;
                return (
                  <Pressable
                    key={slot.id}
                    disabled={!slot.available}
                    onPress={() => setSelectedSlotId(slot.id)}
                    style={({ pressed }) => [
                      styles.slotChip,
                      {
                        backgroundColor: active ? Colors.orange : surface,
                        borderColor: active ? Colors.orange : slot.available ? border : '#d8d8d8',
                        opacity: !slot.available ? 0.45 : pressed ? 0.95 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.slotChipText, { color: active ? Colors.white : text }]}>{slot.label}</Text>
                    <Text style={[styles.slotChipSubtext, { color: active ? Colors.white : muted }]}>{slot.available ? 'Disponible' : 'Indisponible'}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {step === 4 && selectedOffering && selectedMode && selectedDay && selectedSlot ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>Récapitulatif</Text>
            <SummaryRow label="Professionnel" value={professional.fullName} textColor={text} mutedColor={muted} />
            <SummaryRow label="Prestation" value={selectedOffering.title} textColor={text} mutedColor={muted} />
            <SummaryRow label="Date" value={selectedDay.label} textColor={text} mutedColor={muted} />
            <SummaryRow label="Heure" value={selectedSlot.label} textColor={text} mutedColor={muted} />
            <SummaryRow label="Durée" value={`${selectedOffering.durationMinutes} min`} textColor={text} mutedColor={muted} />
            <SummaryRow label="Mode" value={MODE_LABELS[selectedMode]} textColor={text} mutedColor={muted} />
            <SummaryRow
              label="Lieu"
              value={selectedMode === 'cabinet' ? professional.location.address : selectedMode === 'domicile' ? clientAddress : 'En ligne'}
              textColor={text}
              mutedColor={muted}
            />
            <SummaryRow label="Prix" value={`${selectedOffering.fromPrice.toLocaleString('fr-FR')} FCFA`} textColor={text} mutedColor={muted} />
          </View>
        ) : null}

        {step === 5 && createdBooking ? (
          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.successTitle, { color: text }]}>Demande envoyée</Text>
            <Text style={[styles.subtitle, { color: muted }]}>Votre réservation {createdBooking.id} a bien été créée. Vous la retrouverez dans Mes rendez-vous.</Text>
            <SummaryRow label="Professionnel" value={createdBooking.professionalName} textColor={text} mutedColor={muted} />
            <SummaryRow label="Prestation" value={createdBooking.offeringTitle} textColor={text} mutedColor={muted} />
            <SummaryRow label="Créneau" value={`${createdBooking.dateLabel} · ${createdBooking.timeLabel}`} textColor={text} mutedColor={muted} />
            <View style={styles.actionsColumn}>
              <ButtonSimple text="Voir la réservation" color={Colors.primary} onPress={() => router.replace(`/planning/${createdBooking.id}`)} />
              <View style={styles.actionSpacer} />
              <ButtonSimple text="Retour aux services" color={Colors.darkColor} onPress={() => router.replace('/services')} />
            </View>
          </View>
        ) : null}
      </ScrollView>

      {step < 5 ? (
        <View style={[styles.bottomBar, { backgroundColor: surface, borderTopColor: border }]}>
          <ButtonSimple
            text={step === 4 ? 'Confirmer la réservation' : 'Continuer'}
            color={Colors.primary}
            onPress={() => {
              if (step === 4) {
                confirmBooking().catch(() => {
                  Alert.alert('Erreur', 'Impossible de confirmer cette réservation pour le moment.');
                });
                return;
              }
              goNext();
            }}
            showIndicator={saving}
            disabled={saving}
          />
        </View>
      ) : null}
    </FlexContainer>
  );
}

function SummaryRow({ label, value, textColor, mutedColor }: { label: string; value: string; textColor: string; mutedColor: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: mutedColor }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 112,
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
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 18,
  },
  errorCard: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  headerBack: {
    maxWidth: 150,
    paddingRight: 10,
    justifyContent: 'center',
  },
  headerBackText: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerLeftContainer: {
    paddingLeft: 12,
  },
  headerRightContainer: {
    paddingRight: 12,
  },
  headerRightSpacer: {
    width: 110,
  },
  modeChoice: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  modeText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },
  dayList: {
    paddingBottom: 8,
    paddingRight: 10,
  },
  dayChip: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotChip: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  slotChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  slotChipSubtext: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
  },
  summaryRow: {
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  actionsColumn: {
    marginTop: 8,
  },
  actionSpacer: {
    height: 10,
  },
});
