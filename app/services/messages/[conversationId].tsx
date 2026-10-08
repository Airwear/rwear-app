import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ConversationScreen } from '@/src/features/services/screens';

export default function ConversationRoute() {
  const params = useLocalSearchParams<{ conversationId?: string }>();
  const conversationId = typeof params.conversationId === 'string' ? params.conversationId : '';

  return (
    <>
      <Stack.Screen options={{ title: 'Conversation', headerShown: true }} />
      <ConversationScreen conversationId={conversationId} />
    </>
  );
}