import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ServiceCallScreen } from '@/src/features/services/screens';
import { ServiceCallMode } from '@/src/features/services/types';

function toCallMode(value: string | undefined): ServiceCallMode {
  return value === 'video' ? 'video' : 'voice';
}

export default function ServiceCallRoute() {
  const params = useLocalSearchParams<{ conversationId?: string; mode?: string }>();
  const conversationId = typeof params.conversationId === 'string' ? params.conversationId : '';
  const mode = toCallMode(typeof params.mode === 'string' ? params.mode : undefined);
  const title = mode === 'video' ? 'Appel video' : 'Appel vocal';

  return (
    <>
      <Stack.Screen options={{ title, headerShown: true }} />
      <ServiceCallScreen conversationId={conversationId} mode={mode} />
    </>
  );
}