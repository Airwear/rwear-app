import { View, Text, StyleSheet } from 'react-native';
import { CastButton } from '../../../components/domains/videos/CastButton';

export default function VideoCastScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écran de diffusion vidéo 🎥</Text>

      {/* Bouton Cast toujours visible, utilisant une source de test */}
      <CastButton />
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
