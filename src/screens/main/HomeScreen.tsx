import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCast } from '../../context/CastContext';
import type { RootStackParamList } from '../../navigation';
import apiService from '../../services/api';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type CategoryItem = {
  id: number;
  name: string;
  color: string | undefined;
};

type VideoItem = {
  id: string | number;
  title: string;
  videoUrl: string;
  cover: string | undefined;
  categoryName: string | undefined;
  levelName: string | undefined;
  coachName: string | undefined;
  duration: string | undefined;
  updatedAt: string | undefined;
};

type SortOption = 'recent' | 'title' | 'coach';

const toStringValue = (value: unknown): string | undefined => {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
};

const toNumberValue = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const toDateTimestamp = (value: string | undefined): number => {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const withSoftAlpha = (color: string | undefined, fallback: string): string => {
  const base = resolveCategoryColor(color, fallback);
  if (/^#([A-Fa-f0-9]{6})$/.test(base)) {
    return `${base}1F`;
  }
  return base;
};

const resolveCategoryColor = (color: string | undefined, fallback: string): string => {
  if (!color) {
    return fallback;
  }

  const value = color.trim();
  if (!value) {
    return fallback;
  }

  return value;
};

const getArrayCandidate = (response: unknown): unknown[] => {
  const responseObject = response && typeof response === 'object' ? (response as Record<string, unknown>) : undefined;
  const candidates = [
    response,
    responseObject?.data,
    responseObject?.categories,
    responseObject?.trainings,
    responseObject?.items,
  ];

  const rawList = candidates.find((item) => Array.isArray(item));
  return Array.isArray(rawList) ? rawList : [];
};

const normalizeCategories = (response: unknown): CategoryItem[] => {
  return getArrayCandidate(response)
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const category = entry as Record<string, unknown>;
      const id = toNumberValue(category.id);
      const name =
        toStringValue(category.designation) ||
        toStringValue(category.name) ||
        toStringValue(category.title);

      if (!id || !name) {
        return null;
      }

      return {
        id,
        name,
        color: toStringValue(category.color),
      };
    })
    .filter((item): item is CategoryItem => item !== null);
};

const normalizeVideos = (response: unknown): VideoItem[] => {
  return getArrayCandidate(response)
    .map((entry, index) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const video = entry as Record<string, unknown>;
      const videoUrl =
        toStringValue(video.url) ||
        toStringValue(video.videoUrl) ||
        toStringValue(video.streamUrl) ||
        toStringValue(video.video_url);

      if (!videoUrl) {
        return null;
      }

      return {
        id: toStringValue(video.slug) || toNumberValue(video.id) || `video-${index}`,
        title:
          toStringValue(video.designation) ||
          toStringValue(video.title) ||
          toStringValue(video.name) ||
          'Vidéo sans titre',
        videoUrl,
        cover: toStringValue(video.cover),
        categoryName: toStringValue(video.category_name),
        levelName: toStringValue(video.level_name),
        coachName: toStringValue(video.coach_name),
        duration: toStringValue(video.duration),
        updatedAt:
          toStringValue(video.updated_at) ||
          toStringValue(video.publish_date) ||
          toStringValue(video.register_date),
      };
    })
    .filter((item): item is VideoItem => item !== null);
};

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { isConnected, currentDevice, castVideo } = useCast();
  const navigation = useNavigation<HomeNavigationProp>();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortOption>('recent');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const selectedCategoryColor = useMemo(
    () => resolveCategoryColor(selectedCategory?.color, theme.colors.primary),
    [selectedCategory?.color, theme.colors.primary]
  );

  const onPrimaryTextColor = useMemo(
    () => (theme.colors.background.toLowerCase() === '#000000' ? '#FFFFFF' : theme.colors.background),
    [theme.colors.background]
  );

  const sortedVideos = useMemo(() => {
    const list = [...videos];

    if (selectedSort === 'title') {
      return list.sort((a, b) => a.title.localeCompare(b.title, 'fr'));
    }

    if (selectedSort === 'coach') {
      return list.sort((a, b) => {
        const coachA = a.coachName || '';
        const coachB = b.coachName || '';
        return coachA.localeCompare(coachB, 'fr');
      });
    }

    return list.sort((a, b) => toDateTimestamp(b.updatedAt) - toDateTimestamp(a.updatedAt));
  }, [videos, selectedSort]);

  const heroStats = useMemo(
    () => [
      { label: 'Categories', value: String(categories.length) },
      { label: 'Videos', value: String(videos.length) },
      { label: 'Tri', value: selectedSort === 'recent' ? 'Recent' : selectedSort === 'title' ? 'Titre' : 'Coach' },
    ],
    [categories.length, videos.length, selectedSort]
  );

  const loadCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const response = await apiService.getCategories();
      const parsedCategories = normalizeCategories(response);
      setCategories(parsedCategories);

      if (parsedCategories.length > 0) {
        setSelectedCategoryId((current) => {
          if (current && parsedCategories.some((item) => item.id === current)) {
            return current;
          }
          return parsedCategories[0].id;
        });
      } else {
        setSelectedCategoryId(null);
      }
    } catch {
      setCategories([]);
      setSelectedCategoryId(null);
      setErrorMessage('Impossible de charger les catégories.');
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const loadVideos = useCallback(async (categoryId: number) => {
    setLoadingVideos(true);
    try {
      const response = await apiService.getTrainings({ category_id: String(categoryId) });
      setVideos(normalizeVideos(response));
      setErrorMessage(null);
    } catch {
      setVideos([]);
      setErrorMessage('Impossible de charger les vidéos.');
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setLoadingRefresh(true);
    await loadCategories();
    setLoadingRefresh(false);
  }, [loadCategories]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (selectedCategoryId === null) {
      setVideos([]);
      setLoadingVideos(false);
      return;
    }

    void loadVideos(selectedCategoryId);
  }, [loadVideos, selectedCategoryId]);

  const handleCastPress = useCallback(
    async (video: VideoItem) => {
      if (!isConnected) {
        Alert.alert('Cast non connecté', 'Connecte un appareil Cast pour lancer la vidéo.');
        return;
      }

      try {
        await castVideo(video.videoUrl, video.title, video.cover);
      } catch {
        Alert.alert('Erreur Cast', 'Impossible de caster cette vidéo pour le moment.');
      }
    },
    [castVideo, isConnected]
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={loadingRefresh}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              shadowColor: theme.colors.text,
            },
          ]}
        >
          <View style={[styles.heroAccent, { backgroundColor: theme.colors.primary }]} />
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            Bonjour, {user?.name || 'Utilisateur'}!
          </Text>
          <Text style={[styles.intro, { color: theme.colors.textSecondary }]}>
            Explore tes videos par categorie, puis lis ou caste en un geste.
          </Text>
          <View style={styles.heroStatsRow}>
            {heroStats.map((stat) => (
              <View
                key={stat.label}
                style={[styles.heroStat, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.heroStatValue, { color: theme.colors.text }]}>{stat.value}</Text>
                <Text style={[styles.heroStatLabel, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <View
            style={[
              styles.castPill,
              {
                backgroundColor: isConnected ? withSoftAlpha(theme.colors.success, theme.colors.success) : withSoftAlpha(theme.colors.border, theme.colors.border),
                borderColor: isConnected ? theme.colors.success : theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.castPillText, { color: isConnected ? theme.colors.success : theme.colors.textSecondary }]}>
              {isConnected && currentDevice ? `Cast connecte: ${currentDevice.name}` : 'Aucun cast connecte'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Bibliotheque videos</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            {selectedCategory ? selectedCategory.name : 'Selectionne une categorie'}
          </Text>
        </View>

        <View
          style={[
            styles.filterPanel,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >

          {loadingCategories ? (
            <View style={[styles.loadingBlock, { backgroundColor: theme.colors.background }]}> 
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : categories.length === 0 ? (
            <View style={[styles.loadingBlock, { backgroundColor: theme.colors.background }]}> 
              <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}> 
                Aucune categorie disponible.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={[styles.categoryList, { borderColor: theme.colors.border }]}
              contentContainerStyle={styles.categoryListContent}
              nestedScrollEnabled
            >
              {categories.map((category) => {
                const isActive = category.id === selectedCategoryId;
                const categoryColor = resolveCategoryColor(category.color, theme.colors.primary);
                return (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setSelectedCategoryId(category.id)}
                    style={[
                      styles.categoryItem,
                      {
                        borderColor: isActive ? categoryColor : theme.colors.border,
                        backgroundColor: isActive ? withSoftAlpha(categoryColor, theme.colors.primary) : theme.colors.background,
                      },
                    ]}
                  >
                    <View style={styles.categoryChipContent}>
                      <View
                        style={[
                          styles.categoryColorDot,
                          { backgroundColor: categoryColor },
                        ]}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          { color: theme.colors.text },
                        ]}
                      >
                        {category.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {selectedCategory && (
            <Text
              style={[
                styles.categoryHint,
                { color: resolveCategoryColor(selectedCategory.color, theme.colors.textSecondary) },
              ]}
            >
              Categorie active: {selectedCategory.name}
            </Text>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortRow}
          >
            <TouchableOpacity
              onPress={() => setSelectedSort('recent')}
              style={[
                styles.sortChip,
                {
                  borderColor: selectedSort === 'recent' ? theme.colors.primary : theme.colors.border,
                  backgroundColor: selectedSort === 'recent' ? theme.colors.primary : theme.colors.background,
                },
              ]}
            >
              <Text style={[styles.sortChipText, { color: selectedSort === 'recent' ? onPrimaryTextColor : theme.colors.text }]}>Recent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedSort('title')}
              style={[
                styles.sortChip,
                {
                  borderColor: selectedSort === 'title' ? theme.colors.primary : theme.colors.border,
                  backgroundColor: selectedSort === 'title' ? theme.colors.primary : theme.colors.background,
                },
              ]}
            >
              <Text style={[styles.sortChipText, { color: selectedSort === 'title' ? onPrimaryTextColor : theme.colors.text }]}>Titre A-Z</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedSort('coach')}
              style={[
                styles.sortChip,
                {
                  borderColor: selectedSort === 'coach' ? theme.colors.primary : theme.colors.border,
                  backgroundColor: selectedSort === 'coach' ? theme.colors.primary : theme.colors.background,
                },
              ]}
            >
              <Text style={[styles.sortChipText, { color: selectedSort === 'coach' ? onPrimaryTextColor : theme.colors.text }]}>Coach</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {loadingVideos ? (
          <View style={[styles.loadingBlock, { backgroundColor: theme.colors.surface }]}> 
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : errorMessage ? (
          <View style={[styles.loadingBlock, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}> 
              {errorMessage}
            </Text>
          </View>
        ) : sortedVideos.length === 0 ? (
          <View style={[styles.loadingBlock, { backgroundColor: theme.colors.surface }]}> 
            <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}> 
              Aucune video dans cette categorie.
            </Text>
          </View>
        ) : (
          sortedVideos.map((video) => {
            const subtitleParts = [video.levelName, video.coachName].filter(Boolean);
            return (
              <View
                key={String(video.id)}
                style={[
                  styles.videoCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    shadowColor: theme.colors.text,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('VideoPlayer', { videoUrl: video.videoUrl })}
                  activeOpacity={0.9}
                >
                  <View style={styles.videoCoverWrap}>
                    {video.cover ? (
                      <Image source={{ uri: video.cover }} style={styles.videoCover} resizeMode="cover" />
                    ) : (
                      <View style={[styles.videoCoverFallback, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.videoCoverFallbackText, { color: onPrimaryTextColor }]}>VIDEO</Text>
                      </View>
                    )}
                    <View style={[styles.videoCoverOverlay, { backgroundColor: withSoftAlpha(theme.colors.text, theme.colors.text) }]} />
                    <View style={styles.videoTopBadges}>
                      {selectedCategory && (
                        <View style={[styles.videoCategoryBadge, { backgroundColor: selectedCategoryColor }]}>
                          <Text style={[styles.videoCategoryBadgeText, { color: onPrimaryTextColor }]}>{selectedCategory.name}</Text>
                        </View>
                      )}
                      <View style={[styles.playBadge, { backgroundColor: withSoftAlpha(theme.colors.background, theme.colors.background), borderColor: theme.colors.border }]}>
                        <Text style={[styles.playBadgeText, { color: theme.colors.text }]}>Lecture</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.videoContent}>
                    <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                      {subtitleParts.length > 0 ? subtitleParts.join(' • ') : 'Appuyez pour lire'}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.videoActions, { borderTopColor: theme.colors.border }]}> 
                  <TouchableOpacity
                    style={[styles.videoActionBtn, { backgroundColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('VideoPlayer', { videoUrl: video.videoUrl })}
                  >
                    <Text style={[styles.videoActionBtnText, { color: onPrimaryTextColor }]}>Lire</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.videoActionBtn,
                      {
                        backgroundColor: isConnected ? theme.colors.success : theme.colors.background,
                        borderWidth: 1,
                        borderColor: isConnected ? theme.colors.success : theme.colors.border,
                      },
                    ]}
                    onPress={() => void handleCastPress(video)}
                  >
                    <Text
                      style={[
                        styles.videoActionBtnText,
                        { color: isConnected ? onPrimaryTextColor : theme.colors.textSecondary },
                      ]}
                    >
                      Caster
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    padding: 20,
    paddingTop: 54,
    paddingBottom: 8,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    overflow: 'hidden',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroAccent: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 120,
    right: -50,
    top: -80,
    opacity: 0.2,
  },
  greeting: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  intro: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  heroStat: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  heroStatLabel: {
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  castPill: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  castPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    padding: 20,
    paddingTop: 8,
  },
  sectionHeaderRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
  },
  filterPanel: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  categoryList: {
    maxHeight: 230,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 8,
  },
  categoryListContent: {
    padding: 10,
    gap: 8,
  },
  categoryItem: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  categoryChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryColorDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryHint: {
    marginTop: 6,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '700',
  },
  sortRow: {
    paddingBottom: 4,
    gap: 10,
  },
  sortChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  loadingBlock: {
    padding: 18,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
  },
  videoCard: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  videoCoverWrap: {
    position: 'relative',
  },
  videoCover: {
    width: '100%',
    height: 186,
  },
  videoCoverOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  videoTopBadges: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoCoverFallback: {
    width: '100%',
    height: 186,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoCoverFallbackText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  videoContent: {
    padding: 15,
  },
  videoActions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  videoActionBtn: {
    flex: 1,
    borderRadius: 12,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoActionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  videoMetaRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  videoCategoryBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  videoCategoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  playBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  playBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
  },
});
