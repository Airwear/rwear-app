import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { ButtonSimple } from '@/components/buttons';
import { BookingListItem } from '@/src/features/services/components/BookingListItem';
import { useBookings } from '@/src/features/services/hooks/useBookings';

export function BookingsHomeSection() {
  const { recentBookings, hasBookings } = useBookings();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;

  return (
    <View style={[styles.container, { backgroundColor: surface, borderColor: border }]}> 
      <View style={styles.head}>
        <View style={styles.headMain}>
          <Text style={[styles.title, { color: text }]}>Mes rendez-vous</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Vos rendez-vous Services les plus récents.</Text>
        </View>
      </View>

      {!hasBookings ? (
        <View>
          <Text style={[styles.emptyText, { color: muted }]}>Aucun rendez-vous pour le moment.</Text>
          <View style={styles.actionTop}>
            <ButtonSimple text="Explorer les services" color={Colors.primary} onPress={() => router.push('/services')} />
          </View>
        </View>
      ) : (
        <>
          {recentBookings.map((booking) => (
            <BookingListItem key={booking.id} booking={booking} onPress={() => router.push(`/planning/${booking.id}`)} />
          ))}
          <ButtonSimple text="Voir tout" color={Colors.darkColor} onPress={() => router.push('/planning')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  head: {
    marginBottom: 8,
  },
  headMain: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionTop: {
    marginTop: 12,
  },
});
