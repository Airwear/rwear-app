import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle: string;
};

export function ProviderApplicationStepHeader({ step, total, title, subtitle }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;
  const inactive = isDark ? '#2A2E34' : '#eceef2';

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        {Array.from({ length: total }).map((_, index) => {
          const current = index + 1;
          const active = current <= step;

          return (
            <View style={styles.segment} key={current}>
              <View style={[styles.dot, { backgroundColor: active ? Colors.orange : inactive }]} />
              {current < total ? (
                <View style={[styles.line, { backgroundColor: active ? Colors.orange : inactive }]} />
              ) : null}
            </View>
          );
        })}
      </View>

      <Text style={[styles.title, { color: text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: muted }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
});
