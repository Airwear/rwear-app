import { StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/Themed';
import { FlexContainer, ImageViewer } from '@/components';
import { ButtonSimple } from '@/components/buttons';
import Colors from '@/constants/Colors';
import { icons } from '@/utils';

export default function WelcomeScreen() {
  
  const goToSignIn = () => {
    router.push('/sign-in');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <FlexContainer color={Colors.white} push>
      <ImageViewer 
        placeholderImageSource={icons.logo} 
        width={125}
        height={125}
      />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Bienvenue sur AIRWEAR</Text>
          <Text style={styles.subtitle}>Votre application de sport et bien-être</Text>
          <Text style={styles.description}>
            Transformez votre vie avec des plans d'entraînement personnalisés et un suivi intelligent de votre progression.
          </Text>

          <View style={{ height: 40 }} />

          <ButtonSimple 
            text="Se connecter"
            color={Colors.primary}
            onPress={goToSignIn}
          />

          <View style={{ height: 16 }} />

          <ButtonSimple 
            text="Créer un compte"
            color={Colors.danger}
            onPress={goToRegister}
          />

          <View style={{ height: 50 }} />

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💪</Text>
              <Text style={styles.featureText}>Plans personnalisés</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>Suivi en temps réel</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Atteindre vos objectifs</Text>
            </View>
          </View>
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
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.muted,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.muted,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.muted,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 21,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 60,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: Colors.muted,
    opacity: 0.7,
    textAlign: 'center',
  },
});
