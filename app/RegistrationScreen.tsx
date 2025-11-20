import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';
import { Stack, useRouter } from 'expo-router';

// NOTE: Flux demandé: Welcome -> Registration -> Login
// Après inscription on renvoie l'utilisateur vers l'écran de login (sign-in)
// Ce fichier est la version route Expo Router de l'ancien RegistrationScreen.

export default function RegistrationScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [pathology, setPathology] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Données envoyées au backend :', {
        name, email, username, birthDate, phone, country, city, weight, height, goal, pathology, password
      });
      // Redirection vers la page de login selon flux souhaité
      router.replace('/sign-in');
    } catch (err: any) {
      setError('Erreur lors de l’inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Inscription' }} />
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Inscription</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Nom" placeholderTextColor={theme.colors.textSecondary} value={name} onChangeText={setName} />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Email" placeholderTextColor={theme.colors.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Pseudo" placeholderTextColor={theme.colors.textSecondary} value={username} onChangeText={setUsername} />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Date de naissance" placeholderTextColor={theme.colors.textSecondary} value={birthDate} onChangeText={setBirthDate} />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Téléphone" placeholderTextColor={theme.colors.textSecondary} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Pays" placeholderTextColor={theme.colors.textSecondary} value={country} onChangeText={setCountry} />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Ville" placeholderTextColor={theme.colors.textSecondary} value={city} onChangeText={setCity} />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Poids (kg)" placeholderTextColor={theme.colors.textSecondary} value={weight} onChangeText={setWeight} keyboardType="numeric" />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Taille (cm)" placeholderTextColor={theme.colors.textSecondary} value={height} onChangeText={setHeight} keyboardType="numeric" />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Objectif" placeholderTextColor={theme.colors.textSecondary} value={goal} onChangeText={setGoal} />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Pathologie" placeholderTextColor={theme.colors.textSecondary} value={pathology} onChangeText={setPathology} />
        <TextInput style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]} placeholder="Mot de passe" placeholderTextColor={theme.colors.textSecondary} value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>S'inscrire</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={() => router.push('/sign-in')}>
          <Text style={[styles.linkText, { color: theme.colors.primary }]}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 15 },
  button: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: '#FF3B30', marginBottom: 15, textAlign: 'center' },
  linkButton: { marginTop: 10, alignItems: 'center' },
  linkText: { fontSize: 14, fontWeight: '500' },
});
