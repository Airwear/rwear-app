import { View, Text, StyleSheet } from 'react-native';

export default function VideoCastScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écran de diffusion vidéo 🎥</Text>
      {/* Emplacement pour intégrer mon composant de cast vidéo */}
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
  },
});