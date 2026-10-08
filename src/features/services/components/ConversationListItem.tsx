import React from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { ServiceConversation } from '@/src/features/services/types';

type Props = {
  conversation: ServiceConversation;
  onPress?: () => void;
};

function formatConversationDate(value: string) {
  const date = new Date(value);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function ConversationListItem({ conversation, onPress }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;
  const soft = isDark ? '#1B2026' : '#F6F7F9';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: surface,
          borderColor: border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: soft, borderColor: border }]}>
        <Text style={[styles.avatarText, { color: text }]}>{getInitials(conversation.professionalName)}</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.headRow}>
          <Text style={[styles.name, { color: text }]} numberOfLines={1}>{conversation.professionalName}</Text>
          <Text style={[styles.date, { color: muted }]}>{formatConversationDate(conversation.lastMessageAt)}</Text>
        </View>

        <Text style={[styles.offering, { color: muted }]} numberOfLines={1}>{conversation.offeringTitle}</Text>
        <Text style={[styles.preview, { color: text }]} numberOfLines={2}>{conversation.lastMessage}</Text>
      </View>

      {conversation.unreadCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
  },
  main: {
    flex: 1,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  date: {
    fontSize: 11,
    fontWeight: '600',
  },
  offering: {
    fontSize: 12,
    marginTop: 3,
  },
  preview: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
});