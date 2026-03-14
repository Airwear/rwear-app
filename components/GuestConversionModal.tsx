import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ModalSlide from './ModalSlide';
import { ButtonSimple } from './buttons';
import { Title } from '.';
import { Text } from './Themed';
import Colors from '@/constants/Colors';
import { useAuth } from '@/hooks';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function GuestConversionModal({ visible, onClose }: Props) {
  const { signOutGuest } = useAuth();

  const goToRegister = () => {
    onClose();
    signOutGuest();
    router.push('/register');
  };

  const goToSignIn = () => {
    onClose();
    signOutGuest();
    router.push('/sign-in');
  };

  return (
    <ModalSlide
      isVisible={visible}
      onClose={onClose}
      title="Compte requis"
      height="42%"
    >
      <View style={styles.container}>
        <Text style={styles.icon}>🔒</Text>
        <Title
          text="Créez un compte gratuit"
          size={18}
          align="center"
          weight="bold"
        />
        <Text style={styles.description}>
          Cette fonctionnalité est réservée aux membres. Rejoignez la communauté en quelques secondes.
        </Text>
        <View style={styles.actions}>
          <ButtonSimple
            text="Créer un compte"
            color={Colors.primary}
            onPress={goToRegister}
          />
          <View style={styles.gap} />
          <ButtonSimple
            text="Se connecter"
            color={Colors.muted}
            onPress={goToSignIn}
          />
        </View>
      </View>
    </ModalSlide>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  icon: {
    fontSize: 36,
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    color: Colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 10,
  },
  actions: {
    width: '100%',
    marginTop: 4,
  },
  gap: {
    height: 8,
  },
});
