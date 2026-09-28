import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { BookingFlowScreen } from '@/src/features/services/screens';

export default function BookingFlowRoute() {
  const params = useLocalSearchParams<{ professionalId?: string; offeringId?: string }>();
  const professionalId = typeof params.professionalId === 'string' ? params.professionalId : '';
  const offeringId = typeof params.offeringId === 'string' ? params.offeringId : undefined;

  return (
    <>
      <Stack.Screen options={{ title: 'Réserver', headerShown: true }} />
      <BookingFlowScreen professionalId={professionalId} initialOfferingId={offeringId} />
    </>
  );
}
