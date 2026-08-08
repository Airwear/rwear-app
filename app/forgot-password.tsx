import { StyleSheet, View, ScrollView } from 'react-native';
import { FlexContainer, Form, Title } from '@/components';
import { ButtonSimple } from '@/components/buttons';
import { useState } from 'react';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { _post, apiRoutes } from '@/services/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async () => {
    const value = email.trim();
    if (!value) {
      setError('Veuillez saisir une adresse email.');
      setSuccessMessage('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    const controller = new AbortController();

    try {
      const response = await _post(apiRoutes.forgotPassword, { email: value }, controller);
      const message = response?.message || 'Si un compte existe avec cette adresse email, un lien de réinitialisation vous a été envoyé. Consultez votre boîte mail.';
      setSuccessMessage(message);
    } catch (e: any) {
      const status = e?.response?.status;
      const payload = e?.response?.data;

      if (status === 422) {
        setError(payload?.message || 'Adresse email invalide.');
      } else if (status === 429) {
        setError(payload?.message || 'Veuillez patienter avant de réessayer.');
      } else {
        setError(payload?.message || e?.friendlyMessage || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexContainer color={Colors.white} push>
      <View style={styles.container}>
        <ScrollView>
          {error.length > 0 && <Title text={error} color={Colors.danger} size={15} />}
          {successMessage.length > 0 && <Title text={successMessage} color={Colors.primary} size={15} />}

          <Form.Input
            label={'Email'}
            value={email}
            placeholder={'utilisateur@exemple.com'}
            onChangeText={(value: string) => setEmail(value)}
            error={undefined}
          />

          <View style={{ height: 10 }} />

          <ButtonSimple
            text={'Envoyer le lien'}
            color={Colors.primary}
            onPress={handleSubmit}
            showIndicator={loading}
            disabled={loading}
          />

          <View style={{ height: 10 }} />

          <ButtonSimple
            text={'Retour à la connexion'}
            color={Colors.darkColor}
            onPress={() => router.replace('/sign-in')}
            disabled={loading}
          />
        </ScrollView>
      </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
});
