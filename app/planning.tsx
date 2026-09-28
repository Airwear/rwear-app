import React from 'react';
import { Stack } from 'expo-router';
import { BookingsListScreen } from '@/src/features/services/screens';

export default function PlanningRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Mes rendez-vous', headerShown: true }} />
      <BookingsListScreen />
    </>
  );
}
