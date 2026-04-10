import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, View, useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { FlexContainer, ImageViewer, Form, AppPolicy } from '@/components';
import Dropdown from '@/components/inputs/Dropdown';
import { ButtonSimple } from '@/components/buttons';
import { icons } from '@/utils';
import { useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next';

const COUNTRIES = [
  { key: 'Algérie', value: 'Algérie' },
  { key: 'Allemagne', value: 'Allemagne' },
  { key: 'Angola', value: 'Angola' },
  { key: 'Arabie Saoudite', value: 'Arabie Saoudite' },
  { key: 'Argentine', value: 'Argentine' },
  { key: 'Australie', value: 'Australie' },
  { key: 'Belgique', value: 'Belgique' },
  { key: 'Bénin', value: 'Bénin' },
  { key: 'Brésil', value: 'Brésil' },
  { key: 'Burkina Faso', value: 'Burkina Faso' },
  { key: 'Cameroun', value: 'Cameroun' },
  { key: 'Canada', value: 'Canada' },
  { key: 'Chine', value: 'Chine' },
  { key: "Côte d'Ivoire", value: "Côte d'Ivoire" },
  { key: 'Espagne', value: 'Espagne' },
  { key: 'États-Unis', value: 'États-Unis' },
  { key: 'France', value: 'France' },
  { key: 'Gabon', value: 'Gabon' },
  { key: 'Ghana', value: 'Ghana' },
  { key: 'Guinée', value: 'Guinée' },
  { key: 'Inde', value: 'Inde' },
  { key: 'Italie', value: 'Italie' },
  { key: 'Japon', value: 'Japon' },
  { key: 'Liban', value: 'Liban' },
  { key: 'Madagascar', value: 'Madagascar' },
  { key: 'Mali', value: 'Mali' },
  { key: 'Maroc', value: 'Maroc' },
  { key: 'Mauritanie', value: 'Mauritanie' },
  { key: 'Mexique', value: 'Mexique' },
  { key: 'Niger', value: 'Niger' },
  { key: 'Nigéria', value: 'Nigéria' },
  { key: 'Pays-Bas', value: 'Pays-Bas' },
  { key: 'Portugal', value: 'Portugal' },
  { key: 'RD Congo', value: 'RD Congo' },
  { key: 'République du Congo', value: 'République du Congo' },
  { key: 'Royaume-Uni', value: 'Royaume-Uni' },
  { key: 'Rwanda', value: 'Rwanda' },
  { key: 'Sénégal', value: 'Sénégal' },
  { key: 'Suisse', value: 'Suisse' },
  { key: 'Tchad', value: 'Tchad' },
  { key: 'Togo', value: 'Togo' },
  { key: 'Tunisie', value: 'Tunisie' },
  { key: 'Turquie', value: 'Turquie' },
];

const goalOptions = [
  'remise en forme',
  'perte de poids',
  'raffermir le corps',
  'ventre plat',
  'prise de masse musculaire',
  'relaxation (yoga, Stretch)',
];

const pathologyOptions = [
  'Non',
  'Diabète',
  'Cancer',
  'Maladies cardiovasculaires',
  'Autres',
];


function StepIndicator({ step, isDark }: { step: number; isDark: boolean }) {
  const stepInactive = isDark ? '#2A2E34' : '#eceef2';
  const stepMuted = isDark ? '#9AA3AD' : Colors.muted;
  return (
    <View style={styles.stepRow}>
      {[1, 2, 3].map(s => (
        <View key={s} style={styles.stepItem}>
          <View style={[styles.stepDot, { backgroundColor: stepInactive }, step >= s && styles.stepDotActive]}>
            <Text style={[styles.stepDotText, { color: stepMuted }, step >= s && styles.stepDotTextActive]}>
              {s}
            </Text>
          </View>
          {s < 3 && <View style={[styles.stepLine, { backgroundColor: stepInactive }, step > s && styles.stepLineActive]} />}
        </View>
      ))}
    </View>
  );
}

export default function RegistrationScreen() {
  const router = useRouter();
  const { register, registering, error: authError } = useAuth();
  const scheme = useColorScheme();
  const bg = scheme === 'dark' ? Colors.dark.background : Colors.light.background;
  const isDark = scheme === 'dark';
  const surface = isDark ? '#121418' : Colors.white;
  const border = isDark ? '#2A2E34' : '#eceef2';
  const titleColor = isDark ? Colors.white : Colors.darkColor;
  const mutedColor = isDark ? '#9AA3AD' : Colors.muted;
  const errorBg = isDark ? '#3A1F24' : '#fdeaea';
  const { t } = useTranslation();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Étape 1
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Étape 2
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>(new Date(2000, 0, 1));
  const [phone, setPhone] = useState('');

  // Étape 3
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [pathology, setPathology] = useState('');
  const [pathologyOther, setPathologyOther] = useState('');

  const [localError, setLocalError] = useState('');

  const validateStep1 = (): boolean => {
    if (!email || !username || !password) {
      setLocalError('Email, pseudo et mot de passe sont obligatoires.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError('Adresse email invalide.');
      return false;
    }
    if (password.length < 6) {
      setLocalError('Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }
    return true;
  };

  const goNext = () => {
    setLocalError('');
    if (step === 1 && !validateStep1()) return;
    if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3);
  };

  const goPrev = () => {
    setLocalError('');
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3);
  };

  const handleRegister = async () => {
    setLocalError('');
    try {
      await register(email, username, password, undefined, {
        last_name: lastName || undefined,
        first_name: firstName || undefined,
        phone: phone || undefined,
        birth_date: birthDate.toISOString().split('T')[0],
        country: country || undefined,
        city: city || undefined,
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
        goal: goal || undefined,
        pathology: pathology === 'Autres' ? pathologyOther : (pathology || undefined),
      });
      if (!authError) {
        router.replace('/sign-in');
      }
    } catch (err: any) {
      if (__DEV__) console.error('Erreur inscription:', err);
    }
  };

  return (
    <FlexContainer color={bg} push>
      <Stack.Screen options={{ title: t('register.screenTitle') }} />

      <ImageViewer
        placeholderImageSource={icons.logo}
        width={100}
        height={100}
      />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <StepIndicator step={step} isDark={isDark} />

          <View style={[styles.headerCard, { backgroundColor: surface, borderColor: border }]}> 
            <Text style={[styles.stepLabel, { color: mutedColor }]}>{t('register.stepLabel', { step })}</Text>
            <Text style={[styles.title, { color: titleColor }]}>{t(`register.stepTitles.${step}`)}</Text>
            <Text style={[styles.subtitle, { color: mutedColor }]}>{t(`register.stepSubtitles.${step}`)}</Text>
          </View>

          {(authError?.length > 0 || localError.length > 0) && (
            <View style={[styles.errorCard, { backgroundColor: errorBg }]}>
              <Text style={styles.error}>{authError || localError}</Text>
            </View>
          )}

          {/* ── Étape 1 : Compte ── */}
          {step === 1 && (
            <View style={[styles.sectionCard, { backgroundColor: surface, borderColor: border }]}> 
              <Form.Input
                label={t('register.fields.email')}
                placeholder={t('register.fields.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                error={undefined}
                keyboardType="email-address"
              />
              <Form.Input
                label={t('register.fields.username')}
                placeholder={t('register.fields.usernamePlaceholder')}
                value={username}
                onChangeText={setUsername}
                error={undefined}
              />
              <Form.InputPassword
                label={t('register.fields.password')}
                placeholder={t('register.fields.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                error={undefined}
                secureTextEntry
              />
            </View>
          )}

          {/* ── Étape 2 : Informations de base ── */}
          {step === 2 && (
            <View style={[styles.sectionCard, { backgroundColor: surface, borderColor: border }]}> 
              <Form.Input
                label={t('register.fields.lastName')}
                placeholder={t('register.fields.lastNamePlaceholder')}
                value={lastName}
                onChangeText={setLastName}
                error={undefined}
              />
              <Form.Input
                label={t('register.fields.firstName')}
                placeholder={t('register.fields.firstNamePlaceholder')}
                value={firstName}
                onChangeText={setFirstName}
                error={undefined}
              />
              <Text style={[styles.sectionTitle, { color: mutedColor }]}>{t('register.fields.birthDate')}</Text>
              <Form.DatePicker
                date={birthDate}
                onSelect={(d: Date) => setBirthDate(d)}
              />
              <Form.Input
                label={t('register.fields.phone')}
                placeholder={t('register.fields.phonePlaceholder')}
                value={phone}
                onChangeText={setPhone}
                error={undefined}
                keyboardType="phone-pad"
              />
            </View>
          )}

          {/* ── Étape 3 : Profil sportif ── */}
          {step === 3 && (
            <View style={[styles.sectionCard, { backgroundColor: surface, borderColor: border }]}> 
              <Text style={[styles.sectionTitle, { color: mutedColor }]}>{t('register.fields.country')}</Text>
              <Dropdown
                data={COUNTRIES}
                placeholder={t('register.fields.countryPlaceholder')}
                onSelect={(val: string) => setCountry(val)}
                search
              />
              <Form.Input
                label={t('register.fields.city')}
                placeholder={t('register.fields.cityPlaceholder')}
                value={city}
                onChangeText={setCity}
                error={undefined}
              />
              <Form.Input
                label={t('register.fields.weight')}
                placeholder={t('register.fields.weightPlaceholder')}
                value={weight}
                onChangeText={setWeight}
                error={undefined}
                keyboardType="numeric"
              />
              <Form.Input
                label={t('register.fields.height')}
                placeholder={t('register.fields.heightPlaceholder')}
                value={height}
                onChangeText={setHeight}
                error={undefined}
                keyboardType="numeric"
              />
              <Text style={[styles.sectionTitle, { color: mutedColor }]}>{t('register.fields.goal')}</Text>
              <Dropdown
                data={goalOptions.map(o => ({ key: o, value: o }))}
                placeholder={t('register.fields.goalPlaceholder')}
                onSelect={(val: string) => setGoal(val)}
              />
              <Text style={[styles.sectionTitle, { color: mutedColor }]}>{t('register.fields.pathology')}</Text>
              <Dropdown
                data={pathologyOptions.map(o => ({ key: o, value: o }))}
                placeholder={t('register.fields.pathologyPlaceholder')}
                onSelect={(val: string) => setPathology(val)}
              />
              {pathology === 'Autres' && (
                <Form.Input
                  label={t('register.fields.pathologyOther')}
                  placeholder={t('register.fields.pathologyOtherPlaceholder')}
                  value={pathologyOther}
                  onChangeText={setPathologyOther}
                  error={undefined}
                />
              )}
            </View>
          )}

          {/* ── Navigation entre étapes ── */}
          <View style={styles.navRow}>
            {step > 1 && (
              <ButtonSimple
                text={t('register.nav.back')}
                color={Colors.muted}
                width="47%"
                onPress={goPrev}
              />
            )}
            {step < 3 ? (
              <ButtonSimple
                text={t('register.nav.next')}
                color={Colors.primary}
                width={step > 1 ? '47%' : '100%'}
                onPress={goNext}
              />
            ) : (
              <ButtonSimple
                text={registering ? t('register.nav.submitting') : t('register.nav.submit')}
                color={Colors.primary}
                width={step > 1 ? '47%' : '100%'}
                onPress={handleRegister}
                showIndicator={registering}
              />
            )}
          </View>

          {step === 1 && (
            <View style={styles.footer}>
              <ButtonSimple
                text={t('register.nav.hasAccount')}
                color={Colors.danger}
                onPress={() => router.push('/sign-in')}
              />
              <AppPolicy />
            </View>
          )}

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
    paddingBottom: 32,
  },
  // ── Indicateur d'étapes ──
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eceef2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
  },
  stepDotText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.muted,
  },
  stepDotTextActive: {
    color: '#fff',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#eceef2',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  // ── Entête ──
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eceef2',
  },
  stepLabel: {
    fontSize: 12,
    color: Colors.muted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
  // ── Carte de section ──
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
    color: Colors.muted,
  },
  // ── Erreur ──
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
    fontSize: 15,
  },
  // ── Navigation ──
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  footer: {
    gap: 10,
  },
});
