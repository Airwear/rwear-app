import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { Professional } from '@/src/features/services/types';

type Props = {
  professional: Professional;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export function ProfessionalCard({ professional, isFavorite, onPress, onToggleFavorite }: Props) {
  const [imageError, setImageError] = React.useState(false);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const rowBg = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;
  const soft = isDark ? '#1B2026' : '#f6f7f9';
  const initials = professional.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join('');
  const modes = Array.from(new Set(professional.offerings.flatMap((item) => item.modes)));
  const hasAvatar = Boolean(professional.avatarUrl && professional.avatarUrl.trim().length > 0 && !imageError);

  const modeLabels: Record<string, string> = {
    cabinet: 'Cabinet',
    domicile: 'Domicile',
    online: 'En ligne',
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: rowBg,
          borderColor: border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        {hasAvatar ? (
          <Image
            source={{ uri: professional.avatarUrl }}
            style={[styles.avatar, { borderColor: border }]}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={[styles.avatar, { backgroundColor: soft, borderColor: border }]}> 
            <Text style={[styles.avatarText, { color: text }]}>{initials || 'PR'}</Text>
          </View>
        )}

        <View style={styles.main}>
          <View style={styles.topRow}>
            <Text style={[styles.name, { color: text }]} numberOfLines={1}>{professional.fullName}</Text>
            <FontAwesome name="angle-right" size={18} color={muted} />
          </View>
          <Text style={[styles.headline, { color: muted }]} numberOfLines={2}>{professional.headline}</Text>
          <Text style={[styles.meta, { color: muted }]}>
            {professional.rating.toFixed(1)} ({professional.reviewCount}) · {professional.location.distanceKm.toFixed(1)} km
          </Text>
          <View style={styles.modesRow}>
            {modes.map((mode) => (
              <View key={mode} style={[styles.modePill, { backgroundColor: soft, borderColor: border }]}> 
                <Text style={[styles.modePillText, { color: muted }]}>{modeLabels[mode]}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.slot, { color: professional.availability.acceptsNewRequests ? Colors.green : Colors.danger }]}>
            {professional.availability.acceptsNewRequests ? `Prochaine dispo: ${professional.availability.nextSlotLabel}` : 'Indisponible actuellement'}
          </Text>
        </View>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
          style={styles.favoriteBtn}
        >
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={20}
            color={isFavorite ? Colors.danger : muted}
          />
        </Pressable>
      </View>
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
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  main: {
    flex: 1,
    paddingRight: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  headline: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
  },
  modesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 7,
  },
  modePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  slot: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
  },
  favoriteBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
