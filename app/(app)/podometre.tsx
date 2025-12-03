import { FlexContainer, ImageViewer, Title} from '@/components';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { _get, } from '@/services/api';
import { Pedometer } from 'expo-sensors';
import { StyleSheet, Text, View } from 'react-native';
import { icons } from '@/utils';
import { Platform } from 'react-native';

export default function TabPodometreScreen() {

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const stepLast24h = 'Étapes effectuées au cours des dernières 24 heures';
  const stepDescription = "L'activité physique permet en effet de réduire une surcharge pondérale, de contrôler la glycémie (sucre dans le sang), la tension artérielle et le cholesterol. Il est ainsi recommandé de pratiquer au moins 30 minutes d'exercice modérée 3 fois par semaine.";

  const subscribe = async () => {
    try {
      // For Android 10+, try to use Pedometer even if isAvailable returns false
      // because some devices don't report availability correctly
      let isAvailable = await Pedometer.isAvailableAsync();
      
      // On Android, always try to enable it
      if (Platform.OS === 'android') {
        isAvailable = true;
      }
      
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        try {
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 1);

          console.log('Fetching step count from', start.toISOString(), 'to', end.toISOString());

          const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);

          if (pastStepCountResult && pastStepCountResult.steps) {
            console.log('Got steps:', pastStepCountResult.steps);
            setPastStepCount(pastStepCountResult.steps);
            setCurrentStepCount(pastStepCountResult.steps);
          } else {
            console.log('No step count result');
            // Set to 0 if no data available yet
            setPastStepCount(0);
            setCurrentStepCount(0);
          }

          // Watch for real-time step updates
          const subscription = Pedometer.watchStepCount(result => {
            console.log('Step update:', result.steps);
            setCurrentStepCount(prevState => {
              const newCount = prevState + result.steps;
              console.log('New total steps:', newCount);
              return newCount;
            });
          });
          
          return subscription;
        } catch (watchError) {
          console.warn('Watch error (will retry):', watchError);
          // Still show available even if watch fails initially
          return null;
        }
      }
    } catch (error) {
      console.error('Erreur podomètre:', error);
      // On Android, try fallback
      if (Platform.OS === 'android') {
        setIsPedometerAvailable('true');
        setHasError(false);
      } else {
        setIsPedometerAvailable('unavailable');
        setHasError(true);
      }
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

        <ImageViewer 
          placeholderImageSource={icons.podometre} 
          width={350}
          height={150}
        />

        <View style={{marginBottom: 16}} />
        
        {isPedometerAvailable === 'checking' && (
          <Title text="Vérification du podomètre..." align='center' color={Colors.muted} />
        )}
        {isPedometerAvailable === 'unavailable' && (
          <Title text="Podomètre non disponible sur cet appareil" align='center' color={Colors.danger} />
        )}
        {isPedometerAvailable === 'true' && (
          <>
            <Title text={stepLast24h.toLocaleUpperCase()} weight='bold' align='center' />
            <Title text={String(currentStepCount)} color={Colors.danger} weight='bold' align='center' size={75} />
            <Title text={stepDescription} size={15} align='center' color={Colors.muted} />
          </>
        )}
      </View>
    </FlexContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});