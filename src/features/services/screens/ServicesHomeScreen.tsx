import React from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { FlexContainer, Loader, WebMapView } from '@/components';
import { useServicesCatalog } from '@/src/features/services/hooks/useServicesCatalog';
import { useServiceConversations } from '@/src/features/services/hooks/useServiceConversations';
import { ProfessionalCard } from '@/src/features/services/components/ProfessionalCard';
import { ServicesFilterModal } from '@/src/features/services/components/ServicesFilterModal';
import { Professional } from '@/src/features/services/types';

function buildOsmEmbedUrl(professionals: Professional[]): string {
  const first = professionals[0];

  if (!first) {
    return 'https://www.openstreetmap.org/export/embed.html?bbox=-4.08%2C5.25%2C-3.95%2C5.39&layer=mapnik';
  }

  const lat = first.location.latitude;
  const lng = first.location.longitude;
  const delta = 0.025;
  const left = lng - delta;
  const right = lng + delta;
  const top = lat + delta;
  const bottom = lat - delta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function ServicesHomeScreen() {
  const {
    categories,
    allSpecialties,
    specialties,
    professionals,
    professionalsByDistance,
    favoriteIds,
    filters,
    viewMode,
    loading,
    error,
    setViewMode,
    applyFilters,
    setQuery,
    setCategory,
    toggleFavorite,
  } = useServicesCatalog();
  // Le résumé Messages repose sur l'état local des conversations (nombre + non lus).
  const { conversations, totalUnreadCount } = useServiceConversations();

  const [filterModalVisible, setFilterModalVisible] = React.useState(false);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bg = isDark ? Colors.dark.background : Colors.light.background;
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const text = isDark ? Colors.white : Colors.darkColor;
  const muted = isDark ? '#9AA3AD' : Colors.muted;
  const inputBg = isDark ? '#1A1F25' : '#fcfcfd';
  const soft = isDark ? '#1B2026' : '#f5f6f8';
  const modeLabel: Record<string, string> = {
    cabinet: 'Cabinet',
    domicile: 'Domicile',
    online: 'En ligne',
  };

  const displayed = viewMode === 'nearby' ? professionalsByDistance : professionals;
  const selectedSpecialtyName = filters.specialtyId
    ? allSpecialties.find((item) => item.id === filters.specialtyId)?.name
    : undefined;
  const selectedCategoryName = filters.categoryId
    ? categories.find((item) => item.id === filters.categoryId)?.name
    : undefined;
  const hasAdvancedFilters = Boolean(filters.specialtyId || filters.mode || filters.maxDistanceKm);
  const hasSelectedCategory = Boolean(filters.categoryId);
  const professionalsTitle = viewMode === 'nearby' ? 'Professionnels près de vous' : 'Professionnels recommandés';

  const categoryIcon: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
    health: 'plus-square',
    'sport-wellness': 'heartbeat',
    beauty: 'magic',
    nutrition: 'leaf',
    'mental-health': 'smile-o',
    'home-services': 'home',
    'other-services': 'briefcase',
  };

  const categoryTint: Record<string, string> = {
    health: Colors.teal,
    'sport-wellness': Colors.orange,
    beauty: '#CE5BA2',
    nutrition: Colors.green,
    'mental-health': '#5C7AEA',
    'home-services': '#A66CFF',
    'other-services': Colors.darkColor,
  };

  const renderProfessional = ({ item }: { item: Professional }) => (
    <ProfessionalCard
      professional={item}
      isFavorite={favoriteIds.includes(item.id)}
      onPress={() => router.push(`/services/${item.id}`)}
      onToggleFavorite={() => {
        toggleFavorite(item.id).catch(() => {});
      }}
    />
  );

  const mapUrl = buildOsmEmbedUrl(professionalsByDistance);

  return (
    <FlexContainer color={bg}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: surface, borderColor: border }]}> 
          <Text style={[styles.heroTitle, { color: text }]}>Services</Text>
          <Text style={[styles.heroSubtitle, { color: muted }]}>Des professionnels à votre service,{'\n'}pour une vie plus saine et équilibrée.</Text>
        </View>

        <View style={[styles.block, { backgroundColor: surface, borderColor: border }]}> 
          <View style={styles.searchRow}>
            <View style={[styles.searchInputWrap, { backgroundColor: inputBg, borderColor: border }]}> 
              <FontAwesome name="search" size={15} color={muted} style={styles.searchIcon} />
              <TextInput
                value={filters.query}
                onChangeText={(value) => setQuery(value)}
                placeholder="Rechercher un professionnel, une spécialité..."
                placeholderTextColor={muted}
                style={[styles.searchInput, { color: text }]}
              />
            </View>

            <Pressable
              onPress={() => setFilterModalVisible(true)}
              style={({ pressed }) => [
                styles.filterCompactBtn,
                {
                  backgroundColor: soft,
                  borderColor: border,
                  opacity: pressed ? 0.92 : 1,
                },
              ]}
            >
              <FontAwesome name="sliders" size={16} color={text} />
            </Pressable>
          </View>

          {hasAdvancedFilters ? (
            <View style={[styles.appliedFiltersWrap, { borderColor: border, backgroundColor: soft }]}> 
              <Text style={[styles.appliedFiltersTitle, { color: muted }]}>Filtres actifs</Text>
              {selectedCategoryName ? (
                <Text style={[styles.appliedFilterText, { color: text }]}>Catégorie: {selectedCategoryName}</Text>
              ) : null}
              {selectedSpecialtyName ? (
                <Text style={[styles.appliedFilterText, { color: text }]}>Spécialité: {selectedSpecialtyName}</Text>
              ) : null}
              {filters.mode ? (
                <Text style={[styles.appliedFilterText, { color: text }]}>Mode: {modeLabel[filters.mode]}</Text>
              ) : null}
              {typeof filters.maxDistanceKm === 'number' ? (
                <Text style={[styles.appliedFilterText, { color: text }]}>Distance: ≤ {filters.maxDistanceKm} km</Text>
              ) : null}
            </View>
          ) : null}

          <Pressable
            onPress={() => router.push('/planning')}
            style={({ pressed }) => [
              styles.bookingEntry,
              {
                backgroundColor: soft,
                borderColor: border,
                opacity: pressed ? 0.94 : 1,
              },
            ]}
          >
            <View style={[styles.bookingIconWrap, { backgroundColor: surface, borderColor: border }]}> 
              <FontAwesome name="calendar" size={16} color={Colors.orange} />
            </View>
            <View style={styles.bookingEntryMain}>
              <Text style={[styles.bookingEntryTitle, { color: text }]}>Mes rendez-vous</Text>
              <Text style={[styles.bookingEntrySub, { color: muted }]}>Consultez et gérez vos rendez-vous</Text>
            </View>
            <FontAwesome name="angle-right" size={18} color={muted} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/services/messages')}
            style={({ pressed }) => [
              styles.bookingEntry,
              {
                backgroundColor: soft,
                borderColor: border,
                opacity: pressed ? 0.94 : 1,
              },
            ]}
          >
            <View style={[styles.bookingIconWrap, { backgroundColor: surface, borderColor: border }]}> 
              <FontAwesome name="comments" size={16} color={Colors.primary} />
            </View>
            <View style={styles.bookingEntryMain}>
              <Text style={[styles.bookingEntryTitle, { color: text }]}>Messages</Text>
              <Text style={[styles.bookingEntrySub, { color: muted }]}>
                {conversations.length > 0
                  ? `${conversations.length} conversation(s)${totalUnreadCount > 0 ? ` · ${totalUnreadCount} non lu(s)` : ''}`
                  : 'Discutez avec un professionnel après la création d’un rendez-vous'}
              </Text>
            </View>
            {totalUnreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{totalUnreadCount}</Text>
              </View>
            ) : null}
            <FontAwesome name="angle-right" size={18} color={muted} />
          </Pressable>
        </View>

        <View style={[styles.block, { backgroundColor: surface, borderColor: border }]}> 
          <View style={styles.sectionHeadRow}>
            <Text style={[styles.blockTitle, { color: text }]}>Nos catégories</Text>
            <Pressable onPress={() => setCategory(undefined)}>
              <Text style={[styles.sectionLink, { color: Colors.orange }]}>Voir tout</Text>
            </Pressable>
          </View>

          <View style={styles.categoriesGrid}>
            {categories.map((item) => {
              const active = filters.categoryId === item.id;
              const tint = categoryTint[item.id] || Colors.orange;
              const icon = categoryIcon[item.id] || 'briefcase';
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setCategory(active ? undefined : item.id)}
                  style={({ pressed }) => [
                    styles.categoryTile,
                    {
                      backgroundColor: active ? (isDark ? '#2B2417' : '#FFF4E8') : soft,
                      borderColor: active ? Colors.orange : border,
                      opacity: pressed ? 0.94 : 1,
                    },
                  ]}
                >
                  <View style={[styles.categoryIconWrap, { backgroundColor: active ? Colors.orange : `${tint}22` }]}>
                    <FontAwesome name={icon} size={16} color={active ? Colors.white : tint} />
                  </View>
                  <Text style={[styles.categoryName, { color: text }]}>{item.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {hasSelectedCategory && specialties.length > 0 ? (
          <View style={[styles.block, { backgroundColor: surface, borderColor: border }]}> 
            <View style={styles.sectionHeadRow}>
              <Text style={[styles.blockTitle, { color: text }]}>Spécialités</Text>
              <Pressable
                onPress={() => {
                  applyFilters({ ...filters, specialtyId: undefined }).catch(() => {});
                }}
              >
                <Text style={[styles.sectionLink, { color: Colors.orange }]}>Voir tout</Text>
              </Pressable>
            </View>

            <View style={styles.specialtyWrap}>
              {specialties.map((item) => {
                const active = filters.specialtyId === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      applyFilters({
                        ...filters,
                        specialtyId: active ? undefined : item.id,
                      }).catch(() => {});
                    }}
                    style={({ pressed }) => [
                      styles.specialtyChip,
                      {
                        backgroundColor: active ? Colors.orange : soft,
                        borderColor: active ? Colors.orange : border,
                        opacity: pressed ? 0.92 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.specialtyChipText, { color: active ? Colors.white : text }]}>{item.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {!hasSelectedCategory ? (
          <View style={[styles.block, { backgroundColor: surface, borderColor: border }]}> 
            <Text style={[styles.blockTitle, { color: text }]}>Spécialités</Text>
            <Text style={[styles.specialtyHint, { color: muted }]}>Sélectionnez une catégorie pour afficher ses spécialités.</Text>
          </View>
        ) : null}

        <View style={[styles.block, { backgroundColor: surface, borderColor: border }]}> 
          <View style={styles.resultHeaderTop}>
            <View>
              <Text style={[styles.blockTitle, { color: text }]}>{professionalsTitle}</Text>
            </View>

            <Pressable
              onPress={() => {
                setViewMode('list');
                applyFilters({ ...filters, categoryId: undefined, specialtyId: undefined, mode: undefined, maxDistanceKm: undefined, query: '' }).catch(() => {});
              }}
            >
              <Text style={[styles.sectionLink, { color: Colors.orange }]}>Voir tout</Text>
            </Pressable>
          </View>

          <View style={styles.resultHeaderBottom}>
            <Text style={[styles.resultCount, { color: muted }]}>{displayed.length} résultat(s)</Text>
            <View style={[styles.modeToggle, { backgroundColor: soft, borderColor: border }]}>
              <Pressable
                onPress={() => setViewMode('list')}
                style={({ pressed }) => [
                  styles.modeBtnInner,
                  {
                    backgroundColor: viewMode === 'list' ? Colors.orange : 'transparent',
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
              >
                <Text style={[styles.modeBtnText, { color: viewMode === 'list' ? Colors.white : text }]}>Liste</Text>
              </Pressable>
              <Pressable
                onPress={() => setViewMode('nearby')}
                style={({ pressed }) => [
                  styles.modeBtnInner,
                  {
                    backgroundColor: viewMode === 'nearby' ? Colors.orange : 'transparent',
                    opacity: pressed ? 0.92 : 1,
                    borderLeftWidth: 1,
                    borderLeftColor: border,
                  },
                ]}
              >
                <Text style={[styles.modeBtnText, { color: viewMode === 'nearby' ? Colors.white : text }]}>Proximité</Text>
              </Pressable>
            </View>
          </View>

          {!loading && error.length === 0 && displayed.length > 0 && viewMode === 'nearby' ? (
            <>
              <WebMapView uri={mapUrl} />
              <Text style={[styles.nearbyHint, { color: muted }]}>Ordonné par distance croissante.</Text>
            </>
          ) : null}

          {loading && <Loader visible />}

          {!loading && error.length > 0 && (
            <View style={styles.stateWrap}>
              <Text style={[styles.stateText, { color: Colors.danger }]}>{error}</Text>
            </View>
          )}

          {!loading && error.length === 0 && displayed.length === 0 && (
            <View style={styles.stateWrap}>
              <Text style={[styles.stateText, { color: muted }]}>Aucun professionnel trouvé avec ces critères.</Text>
            </View>
          )}

          {!loading && error.length === 0 && displayed.length > 0 && (
            <FlatList
              data={displayed}
              keyExtractor={(item) => item.id}
              renderItem={renderProfessional}
              scrollEnabled={false}
              initialNumToRender={6}
              maxToRenderPerBatch={8}
              windowSize={7}
            />
          )}
        </View>

        <View style={[styles.providerCard, { backgroundColor: surface, borderColor: border }]}> 
          <Text style={[styles.providerTitle, { color: text }]}>Vous êtes un professionnel ?</Text>
          <Text style={[styles.providerSubtitle, { color: muted }]}>Rejoignez notre plateforme et proposez vos services.</Text>
          <Pressable
            onPress={() => {
              Alert.alert('Bientôt disponible', 'Le parcours prestataire complet sera disponible dans une prochaine phase.');
            }}
            style={({ pressed }) => [
              styles.providerBtn,
              {
                backgroundColor: Colors.primary,
                opacity: pressed ? 0.94 : 1,
              },
            ]}
          >
            <Text style={styles.providerBtnText}>Devenir prestataire</Text>
          </Pressable>
        </View>
      </ScrollView>

      <ServicesFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        specialties={specialties}
        onApply={(next) => {
          applyFilters(next).catch(() => {});
        }}
      />
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  block: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchInputWrap: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    minHeight: 47,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    paddingVertical: 8,
  },
  filterCompactBtn: {
    height: 47,
    width: 44,
    marginLeft: 8,
    flexShrink: 0,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingEntry: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bookingIconWrap: {
    height: 34,
    width: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingEntryMain: {
    flex: 1,
  },
  bookingEntryTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bookingEntrySub: {
    marginTop: 2,
    fontSize: 12,
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  sectionHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryTile: {
    width: '48%',
    minHeight: 82,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  categoryIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  specialtyWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    maxWidth: '100%',
  },
  specialtyChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  specialtyHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  modeToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-end',
    maxWidth: '100%',
  },
  appliedFiltersWrap: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 2,
  },
  appliedFiltersTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  appliedFilterText: {
    fontSize: 12,
    lineHeight: 18,
  },
  modeBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 0,
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultHeaderTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  resultHeaderBottom: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  resultCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  stateWrap: {
    paddingVertical: 10,
  },
  stateText: {
    fontSize: 13,
    lineHeight: 18,
  },
  nearbyHint: {
    fontSize: 12,
    marginBottom: 8,
  },
  providerCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  providerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  providerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  providerBtn: {
    marginTop: 12,
    minHeight: 47,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
