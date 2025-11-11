import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Play, Clock, Flame } from 'lucide-react-native';
import { CastButton } from '../../../components/domains/videos/CastButton';
import { RootStackParamList } from 'types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type VideoItem = {
  id: string;
  title: string;
  duration: number;
  calories: number;
  thumbnail: string;
  videoUrl: string;
};

const FEATURED_VIDEOS: VideoItem[] = [
  {
    id: '1',
    title: 'Cardio Intense 30min',
    duration: 1800,
    calories: 350,
    thumbnail:
      'https://via.placeholder.com/400x250/FF6B35/FFFFFF?text=Cardio+Intense',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '2',
    title: 'Yoga Flow Débutant',
    duration: 2400,
    calories: 180,
    thumbnail: 'https://via.placeholder.com/400x250/4CAF50/FFFFFF?text=Yoga+Flow',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: '3',
    title: 'HIIT Full Body',
    duration: 1200,
    calories: 400,
    thumbnail: 'https://via.placeholder.com/400x250/2196F3/FFFFFF?text=HIIT+Full+Body',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleVideoPress = (video: VideoItem) => {
    navigation.navigate('VideoPlayer', {
      videoUrl: video.videoUrl,
      videoId: video.id,
      title: video.title,
      description: `${Math.floor(video.duration / 60)} min • ${video.calories} kcal`,
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour 👋</Text>
          <Text style={styles.subtitle}>Prêt pour votre entraînement ?</Text>
        </View>
        <CastButton color="#1A1A1A" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>En vedette</Text>

          {FEATURED_VIDEOS.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoCard}
              onPress={() => handleVideoPress(video)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: video.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />

              <View style={styles.playOverlay}>
                <View style={styles.playButton}>
                  <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
                </View>
              </View>

              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{video.title}</Text>

                <View style={styles.videoMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#666666" />
                    <Text style={styles.metaText}>{formatDuration(video.duration)}</Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Flame size={14} color="#FF6B35" />
                    <Text style={styles.metaText}>{video.calories} kcal</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégories</Text>

          <View style={styles.categoriesGrid}>
            <CategoryCard
              title="Cardio"
              icon="🏃"
              color="#FF6B35"
              onPress={() => navigation.navigate('WorkoutList', { category: 'cardio' })}
            />
            <CategoryCard
              title="Force"
              icon="💪"
              color="#4CAF50"
              onPress={() => navigation.navigate('WorkoutList', { category: 'force' })}
            />
            <CategoryCard
              title="Yoga"
              icon="🧘"
              color="#2196F3"
              onPress={() => navigation.navigate('WorkoutList', { category: 'yoga' })}
            />
            <CategoryCard
              title="HIIT"
              icon="⚡"
              color="#9C27B0"
              onPress={() => navigation.navigate('WorkoutList', { category: 'hiit' })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cette semaine</Text>

          <View style={styles.statsContainer}>
            <StatCard value="5" label="Séances" icon="🔥" />
            <StatCard value="2h 30" label="Temps total" icon="⏱️" />
            <StatCard value="1,250" label="Calories" icon="💥" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function CategoryCard({ title, icon, color, onPress }: { title: string; icon: string; color: string; onPress: () => void; }) {
  return (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: color + '15' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.categoryIcon}>{icon}</Text>
      <Text style={[styles.categoryTitle, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: string; }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  videoCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    marginLeft: 6,
    color: '#666666',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryTitle: {
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '32%',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: '#666666',
    marginTop: 4,
  },
});
