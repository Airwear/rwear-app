import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { ServiceCategory } from '@/src/features/services/types';

type Props = {
  categories: ServiceCategory[];
  selectedCategoryId?: string;
  onSelect: (id?: string) => void;
};

export function CategoryChips({ categories, selectedCategoryId, onSelect }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;

  const withAll = [{ id: 'all', name: 'Toutes' } as ServiceCategory, ...categories];

  return (
    <View>
      <FlatList
        horizontal
        data={withAll}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListFooterComponent={<View style={styles.footerSpacer} />}
        renderItem={({ item }) => {
          const effectiveId = item.id === 'all' ? undefined : item.id;
          const active = selectedCategoryId === effectiveId || (item.id === 'all' && !selectedCategoryId);
          return (
            <Pressable
              onPress={() => onSelect(effectiveId)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: active ? Colors.orange : surface,
                  borderColor: active ? Colors.orange : border,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: active ? Colors.white : text }]}>{item.name}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 6,
    paddingLeft: 4,
    paddingRight: 4,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    flexShrink: 0,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footerSpacer: {
    width: 12,
  },
});
