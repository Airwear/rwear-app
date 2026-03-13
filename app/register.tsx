import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { FlexContainer, ImageViewer, Form, AppPolicy } from '@/components';
import Dropdown from '@/components/inputs/Dropdown';
import { ButtonSimple } from '@/components/buttons';
import { icons } from '@/utils';
import { useAuth } from '@/hooks';

const goalOptions = [
  'remise en forme',
  'perte de poids',
  'raffermir le corps',
  'ventre plat',
  'prise de masse musculaire',
  'relaxation (yoga, Stretch)'
];
const pathologyOptions = [
  'Non',
  'Diabète',
  'Cancer',
  'Maladies cardiovasculaire',
  'Autres'
];

export default function RegistrationScreen() {
  const router = useRouter();
  const { register, registering, error: authError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState<string>('');
  const [pathology, setPathology] = useState<string>('');
  const [pathologyOther, setPathologyOther] = useState<string>('');
  const [password, setPassword] = useState('');

  const [localError, setLocalError] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !username) {
      setLocalError('Email, pseudo et mot de passe sont obligatoires');
      return;
    }

    setLocalError('');

    try {
      // Appel API backend via authContext
      await register(email, username, password);
      
      // Si succès (pas d'erreur), rediriger vers sign-in
      // Note: les autres données (poids, taille, etc.) devront être envoyées
      // via un endpoint séparé après connexion
      if (!authError) {
        router.replace('/sign-in');
      }
    } catch (err: any) {
      console.error('Erreur inscription:', err);
    }
  };

  return (
    <FlexContainer color={Colors.white} push>
      <Stack.Screen options={{ title: 'Inscription' }} />

      <ImageViewer 
        placeholderImageSource={icons.logo} 
        width={125}
        height={125}
      />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerCard}>
            <Text style={styles.title}>Créer votre compte</Text>
            <Text style={styles.subtitle}>Renseignez vos informations pour personnaliser vos séances</Text>
          </View>

          {(authError.length > 0 || localError.length > 0) && (
            <View style={styles.errorCard}>
              <Text style={styles.error}>{authError || localError}</Text>
            </View>
          )}

          <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Identification</Text>
          <Form.Input label="Nom" placeholder="Nom" value={name} onChangeText={setName} error={undefined} />
          <Form.Input label="Adresse mail" placeholder="Adresse mail" value={email} onChangeText={setEmail} error={undefined} keyboardType="default" />
          <Form.Input label="Pseudo" placeholder="Pseudo" value={username} onChangeText={setUsername} error={undefined} />
          <Form.Input label="Date de naissance" placeholder="JJ/MM/AAAA" value={birthDate} onChangeText={setBirthDate} error={undefined} />
          <Form.Input label="Tel (WhatsApp)" placeholder="Téléphone" value={phone} onChangeText={setPhone} error={undefined} keyboardType="phone-pad" />
          </View>

          <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Localisation</Text>
          <Form.Input label="Pays" placeholder="Pays" value={country} onChangeText={setCountry} error={undefined} />
          <Form.Input label="Ville" placeholder="Ville" value={city} onChangeText={setCity} error={undefined} />
          </View>

          <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Données corporelles</Text>
          <Form.Input label="Poids (kg)" placeholder="Poids" value={weight} onChangeText={setWeight} error={undefined} keyboardType="numeric" />
          <Form.Input label="Taille (cm)" placeholder="Taille" value={height} onChangeText={setHeight} error={undefined} keyboardType="numeric" />
          </View>

          <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Objectif</Text>
          <Dropdown 
            data={goalOptions.map((opt: string) => ({ key: opt, value: opt }))}
            placeholder="Sélectionner un objectif"
            onSelect={(selected: string) => setGoal(selected)}
          />

          <Text style={styles.sectionTitle}>Avez-vous une pathologie ?</Text>
          <Dropdown 
            data={pathologyOptions.map((opt: string) => ({ key: opt, value: opt }))}
            placeholder="Sélectionner une pathologie"
            onSelect={(selected: string) => setPathology(selected)}
          />
          {pathology === 'Autres' && (
            <Form.Input
              label="Précisez"
              placeholder="Précisez la pathologie"
              value={pathologyOther}
              onChangeText={setPathologyOther}
              error={undefined}
            />
          )}
          </View>

          <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <Form.InputPassword label="Mot de passe" placeholder="Mot de passe" value={password} onChangeText={setPassword} error={undefined} secureTextEntry />

          <View style={styles.spaceSm} />

          <ButtonSimple 
            text="S'inscrire"
            color={Colors.primary}
            onPress={handleRegister}
            showIndicator={registering}
          />

          <View style={styles.spaceSm} />

          <ButtonSimple 
            text="Déjà un compte ? Se connecter"
            color={Colors.danger}
            onPress={() => router.push('/sign-in')}
            showIndicator={false}
          />

          <AppPolicy />
          </View>
        </ScrollView>
      </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eceef2',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.darkColor,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eceef2',
  },
  errorCard: {
    backgroundColor: '#fdeaea',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  error: { 
    color: Colors.danger, 
    textAlign: 'center',
    fontSize: 15 
  },
  sectionTitle: { 
    fontSize: 17, 
    fontWeight: '600', 
    marginTop: 16, 
    marginBottom: 8,
    color: Colors.muted 
  },
  optionsWrap: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 10 
  },
  optionBtn: { 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: Colors.muted, 
    marginRight: 8, 
    marginBottom: 8,
    backgroundColor: Colors.white 
  },
  optionBtnSelected: { 
    backgroundColor: Colors.primary, 
    borderColor: Colors.primary 
  },
  optionText: { 
    color: Colors.muted, 
    fontSize: 13 
  },
  optionTextSelected: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  spaceSm: {
    height: 10,
  },
});
