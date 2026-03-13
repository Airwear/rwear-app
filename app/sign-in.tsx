import { Text,  StyleSheet, View, ScrollView} from 'react-native';
import { AppPolicy, FlexContainer, Form, ImageViewer, Title, } from '@/components';
import { useNavigation, router  } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import { ButtonSimple } from '@/components/buttons';
import {useApp, useAuth} from '@/hooks';
import { icons } from '@/utils';

export default function IndexScreen() {

  const navigation = useNavigation();
  const {  signIn, loading, error, logged } = useAuth();
  const { label } = useApp();

  const [values, setValues] = useState<any>({
    email: '',
    password: '',
  })
  const [info, setInfo] = useState<string>('');

  const handleChange = (value: string, target : 'login' | 'password' | 'email') => {
    setValues({
      ...values,
      [target]: value
    })
  }

  const handleSubmit = async () => {
    const {email, password} = values
    if((email !== undefined && password !== undefined)) {
      await signIn(email, password)
      // Vérifier si la connexion a réussi
      // Si pas d'erreur, rediriger vers l'écran d'accueil
    }
  }

  const newAccount = () => {
    // Aller vers l'écran d'inscription complet
    router.push('/register')
  }

  useEffect(() => {
    navigation.setOptions({ 
      title: label.action.login
    });
  }, [navigation]);

  useEffect(() => {
    // Pré-remplir email si on vient de créer un compte
    AsyncStorage.getItem('@lastRegisteredEmail')
      .then(email => {
        if (email) {
          setValues((v: any) => ({ ...v, email }));
          setInfo('Compte créé, veuillez saisir votre mot de passe.');
          // Optionnel: nettoyer pour ne pas recharger à chaque fois
          AsyncStorage.removeItem('@lastRegisteredEmail');
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Si connexion réussie (logged = true et pas d'erreur), rediriger
    if (logged && !error) {
      router.replace('/(app)');
    }
  }, [logged, error]);

  return (
    <FlexContainer color={Colors.white} push>

      <ImageViewer 
        placeholderImageSource={icons.logo} 
        width={125}
        height={125}

      />

      <View style={styles.container}>

        <ScrollView contentContainerStyle={styles.content}>

            <View style={styles.headerCard}>
              <Text style={styles.title}>Connexion</Text>
              <Text style={styles.subtitle}>Accédez à vos entraînements et suivez votre progression</Text>
            </View>

            {error.length > 0 && <View style={styles.errorCard}><Title text={error} color={Colors.danger} size={15} /></View>}
            {info.length > 0 && <View style={styles.infoCard}><Title text={info} color={Colors.primary} size={14} /></View>}

            <View style={styles.formCard}>

            <Form.Input 
              label={label.user.email} 
              value={values['email']}
              placeholder={label.user.emailAddress}
              onChangeText={(value: string) => handleChange(value, 'email')}
              error={undefined}
            />

            <Form.InputPassword 
              label={label.user.password} 
              placeholder={label.user.password}
              value={values['password']}
              onChangeText={(value: string) => handleChange(value, 'password')}
              error={undefined}
              secureTextEntry
            />
            
            <View style={styles.spaceSm} />

            <ButtonSimple 
              text={label.action.login}
              color={Colors.primary}
              onPress={handleSubmit}
              showIndicator={loading}
              disabled={loading}
            />

            <View style={styles.spaceMd} />

            <ButtonSimple 
              text={label.action.new_account}
              color={Colors.danger}
              onPress={newAccount}
              disabled={loading}
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
    paddingBottom: 30,
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

  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#eceef2',
  },

  title: {
    color: Colors.darkColor,
    fontSize: 22,
    fontWeight: '700',
  },

  subtitle: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  errorCard: {
    backgroundColor: '#fdeaea',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: '#eef7ff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  spaceSm: {
    height: 10,
  },

  spaceMd: {
    height: 18,
  },
});
