import React from 'react';
import { Stack } from 'expo-router';
import { ProviderApplicationStatusScreen } from '@/src/features/services/screens';

export default function ProviderApplicationStatusRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Statut candidature', headerShown: true }} />
      <ProviderApplicationStatusScreen />
    </>
  );
}
