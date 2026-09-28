import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ProfessionalDetailScreen } from '@/src/features/services/screens';

export default function ProfessionalDetailsRoute() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params.id === 'string' ? params.id : '';

  return (
    <>
      <Stack.Screen options={{ title: 'Fiche professionnelle', headerShown: true }} />
      <ProfessionalDetailScreen professionalId={id} />
    </>
  );
}
