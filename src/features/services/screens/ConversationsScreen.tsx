import React from 'react';
import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { FlexContainer, Loader } from '@/components';
import { ConversationListItem } from '@/src/features/services/components/ConversationListItem';
import { useServiceConversations } from '@/src/features/services/hooks/useServiceConversations';

export function ConversationsScreen() {
  const { conversations, hasConversations, loading } = useServiceConversations();
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
          <Text style={[styles.title, { color: text }]}>Messages</Text>
          <Text style={[styles.subtitle, { color: muted }]}>Retrouvez vos échanges avec les professionnels liés à vos rendez-vous Services.</Text>
        </View>

        {loading ? <Loader visible /> : null}

        {!loading && !hasConversations ? (
          <View style={[styles.emptyCard, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.emptyTitle, { color: text }]}>Aucune conversation pour le moment.</Text>
            <Text style={[styles.emptyText, { color: muted }]}>Créez un rendez-vous puis utilisez “Contacter le professionnel” pour démarrer un échange.</Text>
          </View>
        ) : null}

        {!loading && hasConversations ? (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              onPress={() => router.push(`/services/messages/${conversation.id}`)}
            />
          ))
        ) : null}
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
    lineHeight: 18,
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
});