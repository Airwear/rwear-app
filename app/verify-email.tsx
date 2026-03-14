import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { Title } from '@/components';
import { ButtonSimple } from '@/components/buttons';
import { useAuth } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/Themed';

export default function VerifyEmailScreen() {
  const { authData, resendVerificationEmail, refreshUserData, signOut, message, error } = useAuth();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const { t } = useTranslation();

  const handleResend = async () => {
    setResending(true);
    await resendVerificationEmail();
    setResending(false);
  };

  const handleCheck = async () => {
    setChecking(true);
    await refreshUserData();
    setChecking(false);
    // La garde dans (app)/_layout redirige automatiquement si emailVerified devient true
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✉️</Text>
        </View>

        <Title
          text={t('verifyEmail.title')}
          size={22}
          align="center"
          weight="bold"
        />

        <Text style={styles.description}>
          {t('verifyEmail.description', { email: authData?.email ?? '' })}
        </Text>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {!!message && <Text style={styles.successText}>{message}</Text>}

        <View style={styles.actions}>
          <ButtonSimple
            text={checking ? t('verifyEmail.checking') : t('verifyEmail.check')}
            onPress={handleCheck}
            color={Colors.primary}
          />

          <View style={styles.spacer} />

          <ButtonSimple
            text={resending ? t('verifyEmail.resending') : t('verifyEmail.resend')}
            onPress={handleResend}
            color={Colors.muted ?? '#888'}
          />
        </View>

        <Text style={styles.signOutLink} onPress={handleSignOut}>
          {t('verifyEmail.signOut')}
        </Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 64,
  },
  description: {
    marginTop: 16,
    marginBottom: 32,
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  email: {
    fontWeight: '600',
    color: '#222',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  spacer: {
    height: 4,
  },
  errorText: {
    color: '#d00',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  successText: {
    color: '#090',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  signOutLink: {
    marginTop: 32,
    color: Colors.muted ?? '#888',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
