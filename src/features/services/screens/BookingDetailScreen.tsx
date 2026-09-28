import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { FlexContainer, Loader } from '@/components';
import { ButtonSimple } from '@/components/buttons';
import { BOOKING_STATUS_LABELS } from '@/src/features/services/components/BookingListItem';
import { useBookings } from '@/src/features/services/hooks/useBookings';
import { Booking } from '@/src/features/services/types';

const MODE_LABELS = {
  cabinet: 'Cabinet',
  domicile: 'Domicile',
  online: 'En ligne',
} as const;

export function BookingDetailScreen({ bookingId }: { bookingId: string }) {
  const { bookings, cancelBooking } = useBookings();
  const booking = bookings.find((item) => item.id === bookingId) || null;
  const [submitting, setSubmitting] = React.useState(false);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;

  if (!booking) {
    return (
      <FlexContainer color={bg}>
        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
          <Text style={[styles.title, { color: text }]}>Réservation introuvable</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Cette réservation n’existe pas ou n’est plus disponible localement.</Text>
        </View>
      </FlexContainer>
    );
  }

  const cancellable = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <FlexContainer color={bg}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}> 
          <Text style={[styles.title, { color: text }]}>{booking.professionalName}</Text>
          <Text style={[styles.subtitle, { color: muted }]}>{booking.offeringTitle}</Text>
          <SummaryRow label="Statut" value={BOOKING_STATUS_LABELS[booking.status]} textColor={text} mutedColor={muted} />
          <SummaryRow label="Date" value={booking.dateLabel} textColor={text} mutedColor={muted} />
          <SummaryRow label="Heure" value={booking.timeLabel} textColor={text} mutedColor={muted} />
          <SummaryRow label="Mode" value={MODE_LABELS[booking.mode]} textColor={text} mutedColor={muted} />
          <SummaryRow label="Lieu" value={booking.placeLabel} textColor={text} mutedColor={muted} />
          <SummaryRow label="Durée" value={`${booking.durationMinutes} min`} textColor={text} mutedColor={muted} />
          <SummaryRow label="Prix" value={`${booking.price.toLocaleString('fr-FR')} FCFA`} textColor={text} mutedColor={muted} />
          <SummaryRow label="Référence" value={booking.id} textColor={text} mutedColor={muted} />
        </View>

        {cancellable ? (
          <ButtonSimple
            text="Annuler la réservation"
            color={Colors.danger}
            onPress={() => {
              Alert.alert('Annuler la réservation', 'Voulez-vous vraiment annuler cette réservation ?', [
                { text: 'Non', style: 'cancel' },
                {
                  text: 'Oui, annuler',
                  style: 'destructive',
                  onPress: async () => {
                    setSubmitting(true);
                    await cancelBooking(booking.id);
                    setSubmitting(false);
                  },
                },
              ]);
            }}
            showIndicator={submitting}
            disabled={submitting}
          />
        ) : null}
      </ScrollView>
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
    paddingBottom: 40,
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
    marginBottom: 8,
    fontSize: 13,
  },
  summaryRow: {
    marginTop: 10,
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
});
