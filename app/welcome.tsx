import { StyleSheet, View, ScrollView } from 'react-native';
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
          <View style={styles.heroCard}>
            <Text style={styles.title}>Bienvenue sur AIRWEAR</Text>
            <Text style={styles.subtitle}>Votre application de sport et bien-être</Text>
            <Text style={styles.description}>
              Transformez votre vie avec des plans d'entraînement personnalisés et un suivi intelligent de votre progression.
            </Text>

            <View style={styles.spaceLg} />

            <ButtonSimple 
              text="Se connecter"
              color={Colors.primary}
              onPress={goToSignIn}
            />

            <View style={styles.spaceSm} />

            <ButtonSimple 
              text="Créer un compte"
              color={Colors.danger}
              onPress={goToRegister}
            />
          </View>

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
    paddingTop: 12,
  },
  heroCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#eceef2',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.darkColor,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.muted,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
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
    textAlign: 'center',
  },
  spaceLg: {
    height: 24,
  },
  spaceSm: {
    height: 10,
  },
});
