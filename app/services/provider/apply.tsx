import React from 'react';
import { Stack } from 'expo-router';
import { ProviderApplicationScreen } from '@/src/features/services/screens';

export default function ProviderApplicationRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Devenir prestataire', headerShown: true }} />
      <ProviderApplicationScreen />
    </>
  );
}
