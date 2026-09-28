import React from 'react';
import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { FlexContainer } from '@/components';
import { ButtonSimple } from '@/components/buttons';
import { BookingListItem } from '@/src/features/services/components/BookingListItem';
import { useBookings } from '@/src/features/services/hooks/useBookings';

export function BookingsListScreen() {
  const { bookings, hasBookings } = useBookings();
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
        <View style={[styles.heroCard, { backgroundColor: surface, borderColor: border }]}> 
          <Text style={[styles.title, { color: text }]}>Mes rendez-vous</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Retrouvez vos rendez-vous Services et leur statut.</Text>
        </View>

        {!hasBookings ? (
          <View style={[styles.emptyCard, { backgroundColor: surface, borderColor: border }]}> 
            <Text style={[styles.emptyTitle, { color: text }]}>Aucune réservation</Text>
            <Text style={[styles.emptyText, { color: muted }]}>Vos prochains rendez-vous apparaîtront ici.</Text>
            <View style={styles.emptyAction}>
              <ButtonSimple text="Découvrir les services" color={Colors.primary} onPress={() => router.replace('/services')} />
            </View>
          </View>
        ) : (
          bookings.map((booking) => (
            <BookingListItem key={booking.id} booking={booking} onPress={() => router.push(`/planning/${booking.id}`)} />
          ))
        )}
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
  heroCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  emptyAction: {
    marginTop: 16,
  },
});
