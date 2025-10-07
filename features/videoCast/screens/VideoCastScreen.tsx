import { View, Text, StyleSheet } from 'react-native';
import CastButton from '../../components/CastButton';

export default function VideoCastScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écran de diffusion vidéo 🎥</Text>

      {/* Emplacement pour intégrer mon composant de cast vidéo */}
      <CastButton 
        videoUrl="https://example.com/video.mp4"
        videoTitle="Airwear Promo"
        videoSubtitle="Présentation du produit"
        thumbnailUrl="https://example.com/thumbnail.jpg"
        duration={120}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
