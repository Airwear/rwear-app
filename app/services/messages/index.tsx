import React from 'react';
import { Stack } from 'expo-router';
import { ConversationsScreen } from '@/src/features/services/screens';

export default function MessagesRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Messages', headerShown: true }} />
      <ConversationsScreen />
    </>
  );
}