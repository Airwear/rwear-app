import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

import { Text, View } from '@/components/Themed';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      
      <View style={styles.container}>
        <View style={styles.card}>
          <FontAwesome name="exclamation-circle" size={42} color={Colors.muted} style={styles.icon} />
          <Text style={styles.title}>Cet écran n'existe pas.</Text>
          <Text style={styles.subtitle}>Le contenu demandé est introuvable pour le moment.</Text>

          <Link href="/" style={styles.link}>
            <Text style={styles.linkText}>Retour à l’accueil</Text>
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#eceef2',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.darkColor,
  },
  icon: {
    marginBottom: 14,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
  link: {
    marginTop: 22,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.lightColor,
  },
  linkText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
});
