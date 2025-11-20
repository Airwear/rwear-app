import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/authContext';

export default function WelcomeRoute() {
  const { theme } = useTheme();
  const router = useRouter();
  const { logged } = useAuth();

  // Si déjà connecté on bypass l'écran welcome
  useEffect(() => {
    if (logged) {
      router.replace('/');
    }
  }, [logged]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Bienvenue sur Rwear</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Votre plateforme de fitness personnalisée</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/sign-in')}
        >
          <Text style={styles.primaryButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => router.push('/RegistrationScreen')}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 36, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 18, textAlign: 'center', marginTop: 10 },
  buttonContainer: { marginBottom: 40 },
  button: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  primaryButton: {},
  secondaryButton: { borderWidth: 2, backgroundColor: 'transparent' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButtonText: { fontSize: 16, fontWeight: '600' },
});
