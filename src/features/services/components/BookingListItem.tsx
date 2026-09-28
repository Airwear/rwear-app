import React from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { Booking } from '@/src/features/services/types';

export const BOOKING_STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  completed: 'Terminé',
  cancelled: 'Annulé',
} as const;

const BOOKING_MODE_LABELS = {
  cabinet: 'Cabinet',
  domicile: 'Domicile',
  online: 'En ligne',
} as const;

const STATUS_COLORS = {
  pending: '#D98900',
  confirmed: Colors.green,
  completed: Colors.primary,
  cancelled: Colors.danger,
} as const;

type Props = {
  booking: Booking;
  onPress?: () => void;
};

export function BookingListItem({ booking, onPress }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const surface = isDark ? '#1A1F25' : '#EDEDED';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, { backgroundColor: surface, opacity: pressed ? 0.92 : 1 }]}>
      <View style={styles.head}>
        <Text style={[styles.title, { color: text }]} numberOfLines={1}>{booking.professionalName}</Text>
        <Text style={[styles.status, { color: STATUS_COLORS[booking.status] }]}>{BOOKING_STATUS_LABELS[booking.status]}</Text>
      </View>
      <Text style={[styles.subtitle, { color: muted }]} numberOfLines={1}>{booking.offeringTitle}</Text>
      <Text style={[styles.meta, { color: muted }]}>{booking.dateLabel} · {booking.timeLabel} · {BOOKING_MODE_LABELS[booking.mode]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  status: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
  },
});
