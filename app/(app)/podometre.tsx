import { FlexContainer, ImageViewer, Title} from '@/components';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { StyleSheet, View } from 'react-native';
import { icons } from '@/utils';
import { Platform } from 'react-native';

export default function TabPodometreScreen() {

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [, setHasError] = useState(false);

  const stepLast24h = 'Étapes effectuées au cours des dernières 24 heures';
  const stepDescription = "L'activité physique permet en effet de réduire une surcharge pondérale, de contrôler la glycémie (sucre dans le sang), la tension artérielle et le cholesterol. Il est ainsi recommandé de pratiquer au moins 30 minutes d'exercice modérée 3 fois par semaine.";

  const subscribe = async () => {
    try {
      if (Platform.OS === 'android' && typeof Pedometer.requestPermissionsAsync === 'function') {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status !== 'granted') {
          setIsPedometerAvailable('unavailable');
          setHasError(true);
          return null;
        }
      }

      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (!isAvailable) {
        setHasError(true);
        return null;
      }

      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        console.log('Fetching step count from', start.toISOString(), 'to', end.toISOString());

        const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
        const steps = pastStepCountResult?.steps ?? 0;

        setPastStepCount(steps);
        setCurrentStepCount(steps);

        const subscription = Pedometer.watchStepCount(result => {
          const increment = result?.steps ?? 0;
          setCurrentStepCount(prevState => prevState + increment);
        });

        return subscription;
      } catch (watchError) {
        console.warn('Watch error:', watchError);
        return null;
      }
    } catch (error) {
      console.error('Erreur podomètre:', error);
      setIsPedometerAvailable('unavailable');
      setHasError(true);
      return null;
    }
  };

  useEffect(() => {

    let subscription: any;

    const subscribeAsync = async () => {
      subscription = await subscribe();
    };

    subscribeAsync();
    
    return () => subscription && subscription.remove();
  }, []);

  return (
    <FlexContainer color={Colors.white} push>

      <View style={styles.container}>

        <View style={styles.heroCard}>
          <ImageViewer 
            placeholderImageSource={icons.podometre} 
            width={320}
            height={130}
          />
        </View>
        <View style={styles.spaceMd} />
        
        {isPedometerAvailable === 'checking' && (
          <Title text="Vérification du podomètre..." align='center' color={Colors.muted} size={16} />
        )}
        {isPedometerAvailable === 'unavailable' && (
          <View style={styles.errorCard}>
            <Title text="Podomètre non disponible sur cet appareil" align='center' color={Colors.danger} />
          </View>
        )}
        {isPedometerAvailable === 'true' && (
          <View style={styles.statsCard}>
            <Title text={stepLast24h.toLocaleUpperCase()} weight='bold' align='center' size={14} />
            <Title text={String(currentStepCount)} color={Colors.danger} weight='bold' align='center' size={68} />
            <Title text={stepDescription} size={14} align='center' color={Colors.muted} />
          </View>
        )}
      </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eceef2',
  },
  statsCard: {
    marginTop: 4,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#eceef2',
  },
  errorCard: {
    backgroundColor: '#fdeaea',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  spaceMd: {
    marginBottom: 12,
  },
});