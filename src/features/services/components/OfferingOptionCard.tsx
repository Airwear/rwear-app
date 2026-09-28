import React from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { ServiceOffering } from '@/src/features/services/types';

const MODE_LABELS = {
  cabinet: 'Cabinet',
  domicile: 'Domicile',
  online: 'En ligne',
} as const;

type Props = {
  offering: ServiceOffering;
  selected: boolean;
  onPress: () => void;
};

export function OfferingOptionCard({ offering, selected, onPress }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const surface = isDark ? '#121418' : Colors.white;
  const border = selected ? Colors.orange : isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: selected ? (isDark ? '#2B2417' : '#FFF4E8') : surface,
          borderColor: border,
          opacity: pressed ? 0.95 : 1,
        },
      ]}
    >
      <View style={styles.head}>
        <Text style={[styles.title, { color: text }]}>{offering.title}</Text>
        {selected ? <Text style={styles.selectedLabel}>Sélectionnée</Text> : null}
      </View>
      <Text style={[styles.meta, { color: muted }]}>{offering.durationMinutes} min · {offering.fromPrice.toLocaleString('fr-FR')} FCFA</Text>
      <Text style={[styles.modes, { color: muted }]}>{offering.modes.map((mode) => MODE_LABELS[mode]).join(' · ')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  selectedLabel: {
    color: Colors.orange,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  modes: {
    marginTop: 4,
    fontSize: 12,
  },
});
