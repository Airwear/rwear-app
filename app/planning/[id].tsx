import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { BookingDetailScreen } from '@/src/features/services/screens';

export default function BookingDetailRoute() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params.id === 'string' ? params.id : '';

  return (
    <>
      <Stack.Screen options={{ title: 'Détail du rendez-vous', headerShown: true }} />
      <BookingDetailScreen bookingId={id} />
    </>
  );
}
