import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { ServiceMessage } from '@/src/features/services/types';

type Props = {
  message: ServiceMessage;
};

function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessageBubble({ message }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const isClient = message.sender === 'client';
  const isSystem = message.sender === 'system';
  const clientBg = Colors.orange;
  const incomingBg = isDark ? '#1A1F25' : '#F2F4F7';
  const systemBg = isDark ? '#1F242B' : '#F7F7F8';
  const text = isClient ? Colors.white : isDark ? Colors.white : Colors.darkColor;
  const muted = isClient ? 'rgba(255,255,255,0.78)' : isDark ? '#9AA3AD' : Colors.muted;

  return (
    <View style={[styles.row, isClient ? styles.rowEnd : styles.rowStart]}>
      <View
        style={[
          styles.bubble,
          isClient ? { backgroundColor: clientBg } : null,
          !isClient && !isSystem ? { backgroundColor: incomingBg } : null,
          isSystem ? [styles.systemBubble, { backgroundColor: systemBg }] : null,
        ]}
      >
        <Text style={[styles.messageText, { color: text }]}>{message.text}</Text>
        <Text style={[styles.timeText, { color: muted }]}>{formatMessageTime(message.timestamp)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  rowStart: {
    justifyContent: 'flex-start',
  },
  rowEnd: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  systemBubble: {
    alignSelf: 'center',
    maxWidth: '100%',
    borderRadius: 14,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
});